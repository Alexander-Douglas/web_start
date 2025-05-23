from flask import Flask, request, jsonify, render_template
import pip

def install(package):
    print("Installing the library "+package)
    if hasattr(pip, 'main'):
        pip.main(['install', package])
    else:
        pip._internal.main(['install', package])
install("requests")

import requests

app = Flask(__name__)

# API --> weather demand using an API app (OpenWeatherMap)
#API key = dbd5bc945bb792cf9efd2af6370466fd
# https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid=dbd5bc945bb792cf9efd2af6370466fd
#
lon,lat,appid =str() ,str() , "dbd5bc945bb792cf9efd2af6370466fd"
# lat,lon = '51.5072','0.1276'
# payload = {'lat': lat, 'lon': lon, 'appid':appid}

# url = "https://api.openweathermap.org/data/2.5/weather?"

def weather(city_name):
    global payload
    payload = {"q": city_name,"limit": 1,"appid": appid }
    global url
    url = "http://api.openweathermap.org/geo/1.0/direct?"
    name = requests.get(url,params=payload)
    lat = name.json()[0]["lat"]
    lon = name.json()[0]["lon"]
    payload = {'lat': lat, 'lon': lon, 'appid': appid}
    url = "https://api.openweathermap.org/data/2.5/weather?"
    wea = requests.get(url,params=payload).json()
    desc = (wea['weather'][0]['description'])
    temp = str(int((wea['main']['temp'])-273.13)) + " degrees"
    return(city_name,desc,temp)
#weather("London")


# print(requests.get('https://api.openweathermap.org/data/2.5/forecast?lat=51.5072&lon=0.1276&appid=dbd5bc945bb792cf9efd2af6370466fd'))




@app.route("/")
def index():
    return render_template("index.html")

@app.route("/check-password", methods=["POST"])
def check_weather():
    data = request.get_json()
    user_input = data.get("password", "")
    a = weather(user_input)
    return jsonify({"result": "Il fait:"+a})
if __name__ == "__main__":
    app.run(debug=True)
