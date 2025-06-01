from flask import Flask, request, jsonify, render_template

# Import requests library
import pip
def install(package):
    if hasattr(pip, 'main'):
        pip.main(['install', package])
    else:
        pip._internal.main(['install', package])
install("requests")
import requests

app = Flask(__name__)

# API --> weather demand using an API app (OpenWeatherMap)
# API key = dbd5bc945bb792cf9efd2af6370466fd
# https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid=dbd5bc945bb792cf9efd2af6370466fd

appid = "dbd5bc945bb792cf9efd2af6370466fd"
units = "metric"
lang = "fr"

# url = "api.openweathermap.org/data/2.5/weather?"   -> lat, lon, appid, [mode, units, lang]               →  Current weather data
# url = "api.openweathermap.org/geo/1.0/direct?"     -> q, appid, [limit]                                  →  Geocoding (Name -> Coords)
# url = "api.openweathermap.org/data/2.5/forecast?"  -> lat, lon, appid, [units, mode, cnt, units, lang]   →  5-day forecast every 3 hours

# url = "https://api.farmsense.net/v1/moonphases/?"  -> d (UNIX Time)                                      →  Moon phase data

def get_weather(city_name):
    global payload
    global url
    # Geocoding
    payload = {"q": city_name,"limit": 1,"appid": appid}
    url = "https://api.openweathermap.org/geo/1.0/direct?"
    geocode = requests.get(url,params=payload).json()[0]
    print(geocode)
    lat = geocode["lat"]
    lon = geocode["lon"]
    # Weather data
    payload = {'lat': lat, 'lon': lon, 'appid': appid, 'units': units, 'lang': lang}
    url = "https://api.openweathermap.org/data/2.5/weather?"
    weather = requests.get(url,params=payload).json()
    print(weather)
    desc = (weather['weather'][0]['description'])
    # Forecast
    payload = {'lat': lat, 'lon': lon, 'appid': appid, 'units': units, 'lang': lang}
    url = "https://api.openweathermap.org/data/2.5/forecast?"
    forecast = requests.get(url,params=payload).json()
    print(forecast)
    # Moon phase
    d = weather['dt']
    payload = {'d': d}
    url = "https://api.farmsense.net/v1/moonphases/?"
    moonphase = requests.get(url,params=payload).json()
    print(forecast)
    return (geocode,weather,forecast,moonphase)


# print(requests.get('https://api.openweathermap.org/data/2.5/forecast?lat=51.5072&lon=0.1276&appid=dbd5bc945bb792cf9efd2af6370466fd'))




@app.route("/")
def index():
    return render_template("index.html")

@app.route("/check-weather", methods=["POST"])
def check_weather():
    data = request.get_json()
    user_input = data.get("ville", "")
    data = get_weather(user_input)
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
