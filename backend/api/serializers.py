from rest_framework import serializers

class TripPlanRequestSerializer(serializers.Serializer):
    current_location = serializers.CharField(max_length=255)
    pickup_location = serializers.CharField(max_length=255)
    dropoff_location = serializers.CharField(max_length=255)
    current_cycle_used = serializers.FloatField()

class LogEventSerializer(serializers.Serializer):
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    duration_hrs = serializers.FloatField()
    status = serializers.ChoiceField(choices=['Driving', 'OnDuty', 'OffDuty', 'SleeperBerth'])
    description = serializers.CharField()

class DailyLogSerializer(serializers.Serializer):
    day_number = serializers.IntegerField()
    date = serializers.DateField()
    log_image_url = serializers.URLField()
    total_miles_driven = serializers.FloatField()
    total_driving_time = serializers.FloatField()
    total_on_duty_time = serializers.FloatField()
    events = LogEventSerializer(many=True)

class RouteDataSerializer(serializers.Serializer):
    map_geojson = serializers.JSONField()
    stops = serializers.JSONField()

class TripPlanResponseSerializer(serializers.Serializer):
    route_data = RouteDataSerializer()
    daily_logs = DailyLogSerializer(many=True)
