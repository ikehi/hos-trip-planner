from datetime import datetime, timedelta

MAX_DRIVING_HRS_PER_DAY = 11.0
MAX_WINDOW_HRS_PER_DAY = 14.0
REQUIRED_30_MIN_BREAK_AFTER = 8.0
MANDATORY_BREAK_DURATION_HRS = 0.5
MANDATORY_RESET_HRS = 10.0
CYCLE_LIMIT_HRS = 70.0
CYCLE_RESTART_HRS = 34.0

PICKUP_TIME_HRS = 1.0
DROPOFF_TIME_HRS = 1.0
FUEL_STOP_INTERVAL_MILES = 1000.0
FUEL_STOP_DURATION_HRS = 0.5

class HOSSolver:
    def __init__(self, start_time: datetime, initial_cycle_used_hrs: float):
        self.current_time = start_time
        self.events_timeline = []
        self.daily_driving_clock = 0.0
        self.daily_window_clock = 0.0
        self.cumulative_driving_since_break = 0.0
        self.cycle_clock = initial_cycle_used_hrs
        self.on_duty_log_last_8_days = [0.0] * 8
        self.on_duty_log_last_8_days[0] = initial_cycle_used_hrs
        self.total_miles_driven = 0.0

    def add_event(self, duration_hrs: float, status: str, description: str):
        start_t = self.current_time
        end_t = start_t + timedelta(hours=duration_hrs)
        self.current_time = end_t
        event = {
            'start_time': start_t,
            'end_time': end_t,
            'duration_hrs': duration_hrs,
            'status': status,
            'description': description
        }
        self.events_timeline.append(event)
        is_on_duty_event = (status in ('Driving', 'OnDuty'))
        if is_on_duty_event:
            self.daily_window_clock += duration_hrs
            self.cycle_clock += duration_hrs
            self.on_duty_log_last_8_days[-1] += duration_hrs
        if status == 'Driving':
            self.daily_driving_clock += duration_hrs
            self.cumulative_driving_since_break += duration_hrs
        if status == 'OnDuty':
            if duration_hrs >= MANDATORY_BREAK_DURATION_HRS:
                self.cumulative_driving_since_break = 0.0
        if status in ('OffDuty', 'SleeperBerth'):
            if duration_hrs >= MANDATORY_BREAK_DURATION_HRS:
                self.cumulative_driving_since_break = 0.0
            if duration_hrs >= MANDATORY_RESET_HRS:
                self.perform_10_hour_reset()
            if duration_hrs >= CYCLE_RESTART_HRS:
                self.perform_34_hour_restart()

    def perform_10_hour_reset(self):
        self.daily_driving_clock = 0.0
        self.daily_window_clock = 0.0
        self.cumulative_driving_since_break = 0.0

    def perform_34_hour_restart(self):
        self.perform_10_hour_reset()
        self.cycle_clock = 0.0
        self.on_duty_log_last_8_days = [0.0] * 8

    def simulate_drive_segment(self, total_drive_time_hrs: float, total_drive_dist_miles: float):
        drive_time_remaining = total_drive_time_hrs
        miles_driven_this_segment = 0.0
        if total_drive_time_hrs <= 0:
            return
        while drive_time_remaining > 0:
            if self.cycle_clock >= CYCLE_LIMIT_HRS:
                self.add_event(CYCLE_RESTART_HRS, 'OffDuty', 'Mandatory 34-hour cycle restart')
                continue
            if (self.daily_driving_clock >= MAX_DRIVING_HRS_PER_DAY) or (self.daily_window_clock >= MAX_WINDOW_HRS_PER_DAY):
                self.add_event(MANDATORY_RESET_HRS, 'SleeperBerth', 'Mandatory 10-hour reset')
                continue
            if self.cumulative_driving_since_break >= REQUIRED_30_MIN_BREAK_AFTER:
                self.add_event(MANDATORY_BREAK_DURATION_HRS, 'OffDuty', 'Mandatory 30-minute break')
                continue
            if miles_driven_this_segment >= FUEL_STOP_INTERVAL_MILES:
                self.add_event(FUEL_STOP_DURATION_HRS, 'OnDuty', 'Fueling Stop')
                miles_driven_this_segment = 0.0
                continue
            time_until_11hr_limit = MAX_DRIVING_HRS_PER_DAY - self.daily_driving_clock
            time_until_14hr_limit = MAX_WINDOW_HRS_PER_DAY - self.daily_window_clock
            time_until_30min_break = REQUIRED_30_MIN_BREAK_AFTER - self.cumulative_driving_since_break
            time_until_70hr_limit = CYCLE_LIMIT_HRS - self.cycle_clock
            driveable_chunk_hrs = max(0.0, min(
                drive_time_remaining,
                time_until_11hr_limit,
                time_until_14hr_limit,
                time_until_30min_break,
                time_until_70hr_limit
            ))
            if driveable_chunk_hrs <= 0:
                # If zero time allowed, force a short off-duty to break stalemate
                self.add_event(MANDATORY_BREAK_DURATION_HRS, 'OffDuty', 'Stall breaker break')
                continue
            self.add_event(driveable_chunk_hrs, 'Driving', 'Driving')
            drive_time_remaining -= driveable_chunk_hrs
            distance_driven_in_chunk = (driveable_chunk_hrs / total_drive_time_hrs) * total_drive_dist_miles
            miles_driven_this_segment += distance_driven_in_chunk
            self.total_miles_driven += distance_driven_in_chunk

    def generate_plan(self, routes_data):
        route1 = routes_data['to_pickup']
        self.simulate_drive_segment(route1['duration_hrs'], route1['distance_miles'])
        self.add_event(PICKUP_TIME_HRS, 'OnDuty', 'Pickup Activities')
        route2 = routes_data['to_dropoff']
        self.simulate_drive_segment(route2['duration_hrs'], route2['distance_miles'])
        self.add_event(DROPOFF_TIME_HRS, 'OnDuty', 'Dropoff Activities')
        return self.events_timeline
