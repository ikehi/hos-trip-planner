export type LogEvent = {
  start_time: string;
  end_time: string;
  duration_hrs: number;
  status: 'Driving' | 'OnDuty' | 'OffDuty' | 'SleeperBerth';
  description: string;
};

export type DailyLog = {
  day_number: number;
  date: string;
  log_image_url: string;
  total_miles_driven: number;
  total_driving_time: number;
  total_on_duty_time: number;
  events: LogEvent[];
};

export type TripPlanResponse = {
  route_data: {
    map_geojson: any;
    stops: any[];
  };
  daily_logs: DailyLog[];
};
