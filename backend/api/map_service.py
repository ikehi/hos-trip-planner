import requests
from typing import Tuple, Dict, Any

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OSRM_ROUTE_URL = "https://router.project-osrm.org/route/v1/driving/"

# Include a descriptive User-Agent per Nominatim policy
headers = {"User-Agent": "HOSPlanner/1.0 (+https://github.com/ikehi/hos-trip-planner)"}

def get_coords_from_address(address: str) -> Tuple[float, float]:
    params = {"q": address, "format": "json", "limit": 1}
    resp = requests.get(NOMINATIM_URL, params=params, headers=headers, timeout=20)
    resp.raise_for_status()
    data = resp.json()
    if not data:
        raise ValueError(f"No results for address: {address}")
    lat = float(data[0]["lat"]) 
    lon = float(data[0]["lon"]) 
    return (lat, lon)

def get_route_data(start_coords: Tuple[float, float], end_coords: Tuple[float, float]) -> Dict[str, Any]:
    # OSRM expects lon,lat order
    start = f"{start_coords[1]},{start_coords[0]}"
    end = f"{end_coords[1]},{end_coords[0]}"
    url = f"{OSRM_ROUTE_URL}{start};{end}"
    params = {"overview": "full", "geometries": "geojson"}
    resp = requests.get(url, params=params, headers=headers, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    if not data.get("routes"):
        raise ValueError("No route found")
    route = data["routes"][0]
    return {
        "distance_meters": route["distance"],
        "duration_seconds": route["duration"],
        "geometry": route["geometry"],
    }
