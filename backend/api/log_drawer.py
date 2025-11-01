from PIL import Image, ImageDraw
from django.conf import settings
import os

GRID_START_X = 100
GRID_END_X = 900
GRID_WIDTH = GRID_END_X - GRID_START_X
PIXELS_PER_HOUR = GRID_WIDTH / 24.0

Y_LEVEL_OFF_DUTY = 150
Y_LEVEL_SLEEPER = 170
Y_LEVEL_DRIVING = 190
Y_LEVEL_ON_DUTY = 210

TOTAL_MILES_XY = (850, 50)

def get_y_for_status(status: str):
    if status == 'OffDuty': return Y_LEVEL_OFF_DUTY
    if status == 'SleeperBerth': return Y_LEVEL_SLEEPER
    if status == 'Driving': return Y_LEVEL_DRIVING
    if status == 'OnDuty': return Y_LEVEL_ON_DUTY
    return Y_LEVEL_OFF_DUTY

def draw_log_sheet(events_for_day: list, day_number: int, total_miles: float):
    blank_log_path = os.path.join(getattr(settings, 'STATIC_ROOT', ''), 'blank-paper-log.png')
    if not os.path.isfile(blank_log_path):
        img = Image.new('RGBA', (1000, 300), 'white')
    else:
        img = Image.open(blank_log_path).convert('RGBA')
    draw = ImageDraw.Draw(img)

    last_status = 'OffDuty'
    last_x = GRID_START_X

    for event in events_for_day:
        start_hour = event['start_time'].hour + (event['start_time'].minute / 60.0)
        end_hour = event['end_time'].hour + (event['end_time'].minute / 60.0)
        start_x = GRID_START_X + (start_hour * PIXELS_PER_HOUR)
        end_x = GRID_START_X + (end_hour * PIXELS_PER_HOUR)
        y_level = get_y_for_status(event['status'])
        if event['status'] != last_status:
            last_y = get_y_for_status(last_status)
            draw.line([(last_x, last_y), (last_x, y_level)], fill='black', width=2)
        draw.line([(start_x, y_level), (end_x, y_level)], fill='black', width=2)
        last_x = end_x
        last_status = event['status']

    draw.text(TOTAL_MILES_XY, f"{total_miles:.0f}", fill='black')
    media_root = getattr(settings, 'MEDIA_ROOT', os.getcwd())
    media_url = getattr(settings, 'MEDIA_URL', '/media/')
    os.makedirs(media_root, exist_ok=True)
    output_filename = f'log_day_{day_number}.png'
    output_path = os.path.join(media_root, output_filename)
    img.save(output_path)
    return os.path.join(media_url, output_filename)
