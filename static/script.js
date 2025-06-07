const mode = document.getElementById("mode-icon");
const html = document.querySelector("html");
const search = document.getElementById("search-bar");
let modeVal = false;

const modulo = (n, d) => {
  return ((n % d) + d) % d
}

const rightJustify = (text, size, char) => {
  text = String(text);
  return char.repeat(Math.max(0,size-text.length))+text;
}

const updateScreenSize = () => {
  let scale = screen.width/2000;
  document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=2000, initial-scale='+scale);
}

updateScreenSize()

mode.addEventListener("click", () => {
  modeVal = !modeVal;
  if (modeVal) {
    // light mode
    mode.innerHTML = "dark_mode";
    mode.style.color = "var(--primary)";
    html.className = "light";
  } else {
    // dark mode
    mode.innerHTML = "light_mode";
    mode.style.color = "var(--secondary)";
    html.className = "dark";
  }
});

// Tous les secondes, remettre à jour l'horaire
let timeInterval = setInterval(() => {}, 1000);

// Tous les 10 minutes, remettre à jour la position de l'astre
let cycleInterval = setInterval(() => {}, 600 * 1000);

let rot = document.querySelector("svg").createSVGTransform();
rot.setRotate(180, 1270, 36.38024);
document.getElementById("radialGradient-half").gradientTransform.baseVal.insertItemBefore(rot, 0);
document.getElementById("radialGradient-partial").gradientTransform.baseVal.insertItemBefore(rot, 0);
delete rot;

function posCircle(angle, rot_offset) {
  let svg = document.querySelector("svg");
  let circle = document.getElementById("cycle-body");
  let grad_half = document.getElementById("radialGradient-half");
  let grad_part = document.getElementById("radialGradient-partial");

  let x = 1270 - 1100 * Math.cos(angle * Math.PI);
  let y = 1233.6199 - 1197.23966 * Math.sin(angle * Math.PI);

  circle.cx.baseVal.value = x;
  circle.cy.baseVal.value = y;
  
  grad_half.gradientTransform.baseVal[0].setRotate(rot_offset + 90 + (180 * angle), x, y);
  grad_part.gradientTransform.baseVal[0].setRotate(rot_offset + 90 + (180 * angle), x, y);

  grad_half.gradientTransform.baseVal[1].matrix.e = x - 956.9722;
  grad_half.gradientTransform.baseVal[1].matrix.f = y - 2690.3917;

  grad_part.gradientTransform.baseVal[1].matrix.e = x - 1753.36934;
  grad_part.gradientTransform.baseVal[1].matrix.f = y - 1429.06814;
}

function drawPhase(phase, angle) {
  let body = document.getElementById("cycle-body");
  switch (phase) {
    case "Dark Moon":
      body.style.fill = "#343c6d";
      posCircle(angle, 0);
      break;
    case "Waxing Crescent":
      body.style.fill = "url(#radialGradient-partial)";
      document.getElementById("radialGradient-partial").href.baseVal =
        "#gradient-inv";
      posCircle(angle, 180);
      break;
    case "1st Quarter":
      body.style.fill = "url(#radialGradient-half)";
      document.getElementById("radialGradient-half").href.baseVal =
        "#gradient-reg";
      posCircle(angle, 0);
      break;
    case "Waxing Gibbous":
      body.style.fill = "url(#radialGradient-partial)";
      document.getElementById("radialGradient-partial").href.baseVal =
        "#gradient-reg";
      posCircle(angle, 0);
      break;
    case "Full Moon":
      body.style.fill = "#6474d3";
      posCircle(angle, 0);
      break;
    case "Waning Gibbous":
      body.style.fill = "url(#radialGradient-partial)";
      document.getElementById("radialGradient-partial").href.baseVal =
        "#gradient-reg";
      posCircle(angle, 180);
      break;
    case "3rd Quarter":
      body.style.fill = "url(#radialGradient-half)";
      document.getElementById("radialGradient-half").href.baseVal =
        "#gradient-reg";
      posCircle(angle, 180);
      break;
    case "Waning Crescent":
      body.style.fill = "url(#radialGradient-partial)";
      document.getElementById("radialGradient-partial").href.baseVal =
        "#gradient-inv";
      posCircle(angle, 0);
      break;
  }
}

function drawCycle(dtSunrise, dtSunset, phase) {
  let path = document.getElementById("cycle-path");
  let body = document.getElementById("cycle-body");
  let dtTime = Date.now()/1000;
  dtSunrise += 86400*((dtSunset <= dtTime) & (dtSunrise < dtTime));
  dtSunset -= 86400*((dtTime <= dtSunrise) & (dtTime < dtSunset));
  if (dtTime <= dtSunset) { // S'il fait jour
    let dtDiffSun = dtSunset - dtSunrise;
    let dtDiffTime = dtTime - dtSunrise;
    let percCycle = dtDiffTime/dtDiffSun;
    path.style.stroke = "#f4a75a";
    body.style.stroke = "#ffce9d";
    body.style.fill = "#f4a75a";
    posCircle(percCycle,0);
    console.log("Day", dtDiffSun, dtDiffTime, percCycle);
      } else { // S'il fait nuit
    let dtDiffSun = dtSunrise - dtSunset;
    let dtDiffTime = dtTime - dtSunset;
    let percCycle = dtDiffTime/dtDiffSun;
    console.log("Night", dtDiffSun, dtDiffTime, percCycle);
    path.style.stroke = "#343c6d";
    body.style.stroke = "#b0beff";
    drawPhase(phase,percCycle)
      };
  }

drawPhase("Waxing Gibbous", 0.3);

weatherIcons = new Map([
  ["200","thunderstorm"],
  ["201","thunderstorm"],
  ["202","thunderstorm"],
  ["210","thunderstorm"],
  ["211","thunderstorm"],
  ["212","thunderstorm"],
  ["221","thunderstorm"],
  ["230","thunderstorm"],
  ["231","thunderstorm"],
  ["232","thunderstorm"],
  ["300","rainy_light"],
  ["301","rainy_light"],
  ["310","rainy_light"],
  ["311","rainy_light"],
  ["500","rainy_light"],
  ["501","rainy_light"],
  ["520","rainy_light"],
  ["521","rainy_light"],
  ["302","rainy_heavy"],
  ["312","rainy_heavy"],
  ["313","rainy_heavy"],
  ["314","rainy_heavy"],
  ["321","rainy_heavy"],
  ["502","rainy_heavy"],
  ["503","rainy_heavy"],
  ["504","rainy_heavy"],
  ["522","rainy_heavy"],
  ["531","rainy_heavy"],
  ["511","weather_mix"],
  ["600","snowing"],
  ["601","snowing"],
  ["602","snowing"],
  ["611","weather_hail"],
  ["612","weather_hail"],
  ["613","weather_hail"],
  ["615","rainy_snow"],
  ["616","rainy_snow"],
  ["620","snowing_heavy"],
  ["621","snowing_heavy"],
  ["622","snowing_heavy"],
  ["701","mist"],
  ["711","mist"],
  ["721","mist"],
  ["731","mist"],
  ["741","mist"],
  ["751","mist"],
  ["761","mist"],
  ["762","mist"],
  ["771","mist"],
  ["781","tornado"],
  ["800d","clear_day"],
  ["800n","moon_stars"],
  ["801d","partly_cloudy_day"],
  ["802d","partly_cloudy_day"],
  ["801n","partly_cloudy_night"],
  ["802n","partly_cloudy_night"],
  ["803","cloud"],
  ["804","cloud"]
])

search.addEventListener("search", () => {
  const ville = document.getElementById("search-bar").value;
  console.log("Bouton touché")
  // Envoi la requête POST au backend Python
  fetch("/check-weather", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ville }),
  })
    .then((response) => response.json()) // Réponse donnée
    .then((data) => { // Retour des données JSON en Objet JS
      console.log(data);
      // Localisation
      document.getElementById("fr-name").innerHTML = Boolean(data[0].local_names.fr)?data[0].local_names.fr.toUpperCase():data[0].name.toUpperCase();
      document.getElementById("location").innerHTML = `${data[0].name.toUpperCase()}, ${Boolean(data[0].state)?data[0].state.toUpperCase()+", ":""}${data[0].country.toUpperCase()}`;
      document.getElementById("coords").innerHTML = `${data[0].lat>=0?"N":"S"}°${Math.abs(data[0].lat)}, ${data[0].lon<=0?"W":"E"}°${Math.abs(data[0].lon)}`;
      // Temps
      let timezone = data[1].timezone/3600
      clearInterval(timeInterval);
      timeInterval = setInterval((timezone) => {
        let now = new Date()
        document.getElementById("local-time").innerHTML = `${rightJustify(modulo(Math.floor(now.getUTCHours()+timezone),24),2,"0")}:`
          +`${rightJustify(modulo(now.getUTCMinutes()+timezone*60,60),2,"0")}:${rightJustify(now.getUTCSeconds(),2,"0")}`
          +` ${Math.sign(timezone)<0?"-":"+"}GMT${rightJustify(Math.abs(Math.floor(timezone)),2,"0")}:${rightJustify(modulo(timezone*60,60),2,"0")}`
      }, 1000, timezone);
      // Calcul de cycle jour/nuit
      let dtSunrise = data[1].sys.sunrise;
      let dtSunset = data[1].sys.sunset;
      let moonPhase = data[3][0].Phase;
      let dtTime = Date.now()/1000;
      dtSunrise += 86400*((dtSunset <= dtTime) & (dtSunrise < dtTime));
      dtSunset -= 86400*((dtTime <= dtSunrise) & (dtTime < dtSunset));
      let date = new Date();
      date.setTime(dtSunrise*1000);
      let sunriseTime = `${rightJustify(modulo(Math.floor(date.getUTCHours()+timezone),24),2,"0")}:`
          +`${rightJustify(modulo(date.getUTCMinutes()+timezone*60,60),2,"0")}`;
      date.setTime(dtSunset*1000);
      let sunsetTime = `${rightJustify(modulo(Math.floor(date.getUTCHours()+timezone),24),2,"0")}:`
          +`${rightJustify(modulo(date.getUTCMinutes()+timezone*60,60),2,"0")}`;
      document.getElementById("cycle-rise-text").innerHTML = dtTime <= dtSunset ? sunriseTime : sunsetTime;
      document.getElementById("cycle-set-text").innerHTML = dtTime <= dtSunset ? sunsetTime : sunriseTime;
      drawCycle(dtSunrise, dtSunset, moonPhase);
      clearInterval(cycleInterval);
      cycleInterval = setInterval(drawCycle, 60 * 1000, dtSunrise, dtSunset, moonPhase);
      // Météo Actuel
      let desc = data[1].weather[0].description.split("");
      desc[0] = desc[0].toUpperCase();
      document.getElementById("wea-desc").innerHTML = desc.join("");
      let weaId = data[1].weather[0].id;
      weaId += data[1].weather[0].icon.slice(-1).repeat(weaId == 800 | weaId == 801 | weaId == 802);
      let weaIcon = weatherIcons.get(weaId);
      document.getElementById("wea-icon").innerHTML = weaIcon;
      let nowTemp = data[1].main.temp.toFixed(2);
      let minTemp = data[1].main.temp_min.toFixed(2);
      let maxTemp = data[1].main.temp_max.toFixed(2);
      document.getElementById("wea-temp").innerHTML = `${nowTemp}°`;
      document.getElementById("wea-minmax_temp").innerHTML = `${minTemp}°/${maxTemp}°`;
      let percHumidity = data[1].main.humidity;
      let percCloudiness = data[1].clouds.all;
      document.getElementById("hum-text").innerHTML = `${percHumidity}%`;
      document.getElementById("cld-text").innerHTML = `${percCloudiness}%`;
      let windDirDeg = data[1].wind.deg;
      let windDirCard = ["N","NE","E","SE","S","SW","W","NW","N"][Math.round(windDirDeg/45)];
      let windSpeed = data[1].wind.speed.toFixed(2);
      document.getElementById("wind-dir").innerHTML = `${windDirDeg}° (${windDirCard})`;
      document.getElementById("wind-speed").innerHTML = `${windSpeed} m/s`;
      document.getElementById("wind-icon").style.transform = `rotate(${windDirDeg}deg)`;
      let windSpeedSize = Math.min(Math.max(3.25, (0.08*windSpeed+3.5).toFixed(1)), 5);
      document.getElementById("wind-icon").style.fontSize = `${windSpeedSize}rem`;
      // Prévisions 3-heures

      // Prévisions 5-jours
      
    })
    .catch((error) => {
      console.log(`Erreur serveur: ${error}`);
    });
});
