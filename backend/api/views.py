from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

from .serializers import TripPlanRequestSerializer, TripPlanResponseSerializer
from .map_service import get_coords_from_address, get_route_data
from .hos_solver import HOSSolver
from .log_drawer import draw_log_sheet

class TripPlannerView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = TripPlanRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        # Map lookups
        start_coords = get_coords_from_address(data['current_location'])
        pickup_coords = get_coords_from_address(data['pickup_location'])
        dropoff_coords = get_coords_from_address(data['dropoff_location'])
        route_to_pickup_raw = get_route_data(start_coords, pickup_coords)
        route_to_dropoff_raw = get_route_data(pickup_coords, dropoff_coords)
        routes_data = {
            'to_pickup': {
                'duration_hrs': route_to_pickup_raw['duration_seconds'] / 3600.0,
                'distance_miles': route_to_pickup_raw['distance_meters'] / 1609.34,
            },
            'to_dropoff': {
                'duration_hrs': route_to_dropoff_raw['duration_seconds'] / 3600.0,
                'distance_miles': route_to_dropoff_raw['distance_meters'] / 1609.34,
            },
        }
        # Simulate
        solver = HOSSolver(datetime.now(), data['current_cycle_used'])
        full_event_timeline = solver.generate_plan(routes_data)
        # Chunk into days (simple placeholder: single day)
        daily_event_chunks = [full_event_timeline]
        generated_logs = []
        for i, day_events in enumerate(daily_event_chunks):
            day_number = i + 1
            miles_for_day = solver.total_miles_driven  # simple total
            image_url = draw_log_sheet(day_events, day_number, miles_for_day)
            generated_logs.append({
                'day_number': day_number,
                'date': day_events[0]['start_time'].date() if day_events else datetime.now().date(),
                'log_image_url': request.build_absolute_uri(image_url),
                'total_miles_driven': miles_for_day,
                'total_driving_time': sum(e['duration_hrs'] for e in day_events if e['status'] == 'Driving'),
                'total_on_duty_time': sum(e['duration_hrs'] for e in day_events if e['status'] in ('Driving','OnDuty')),
                'events': day_events,
            })
        # Build GeoJSON and stops
        features = [
            {
                'type': 'Feature',
                'properties': {'leg': 'to_pickup'},
                'geometry': route_to_pickup_raw['geometry'],
            },
            {
                'type': 'Feature',
                'properties': {'leg': 'to_dropoff'},
                'geometry': route_to_dropoff_raw['geometry'],
            },
        ]
        stops = [
            { 'label': 'Current', 'lat': start_coords[0], 'lon': start_coords[1] },
            { 'label': 'Pickup', 'lat': pickup_coords[0], 'lon': pickup_coords[1] },
            { 'label': 'Dropoff', 'lat': dropoff_coords[0], 'lon': dropoff_coords[1] },
        ]
        route_response_data = {
            'map_geojson': {
                'type': 'FeatureCollection',
                'features': features,
            },
            'stops': stops,
        }
        response_data = {
            'route_data': route_response_data,
            'daily_logs': generated_logs,
        }
        output_serializer = TripPlanResponseSerializer(response_data)
        return Response(output_serializer.data, status=status.HTTP_200_OK)
