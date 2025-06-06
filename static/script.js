const mode = document.getElementById("mode-icon");
const html = document.querySelector("html");
const search = document.getElementById("search-bar");
let modeVal = false;

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

function posCircle(angle, rot_offset) {
  angle = angle * Math.PI;
  let svg = document.querySelector("svg");
  let circle = document.getElementById("cycle-body");
  let grad_half = document.getElementById("radialGradient-half");
  let grad_part = document.getElementById("radialGradient-partial");

  let x = 1270 - 1100 * Math.cos(angle);
  let y = 1233.6199 - 1197.23966 * Math.sin(angle);

  let rot = document.querySelector("svg").createSVGTransform();
  rot.setRotate(rot_offset + 90 + (180 * angle) / Math.PI, x, y);
  grad_half.gradientTransform.baseVal.insertItemBefore(rot, 0);
  grad_part.gradientTransform.baseVal.insertItemBefore(rot, 0);

  circle.cx.baseVal.value = x;
  circle.cy.baseVal.value = y;

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
  let dtTime = Date.now()/1000
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

      // Temps
      let dtTime = data[1].dt;
      let timezone = data[1].timezone/3600
      clearInterval(timeInterval);
      timeInterval = setInterval((timezone) => {
        let now = new Date()
        document.getElementById("local-time").innerHTML = `${rightJustify(Math.floor(now.getUTCHours()+timezone)%24,2,"0")}:`
          +`${rightJustify((now.getUTCMinutes()+timezone*60)%60,2,"0")}:${rightJustify(now.getUTCSeconds(),2,"0")}`
          +` ${Math.sign(timezone)<0?"-":"+"}GMT${rightJustify(Math.abs(timezone),2,"0")}:00`
      }, 1000, timezone);
      // Calcul de cycle jour/nuit
      let dtSunrise = data[1].sys.sunrise;
      let dtSunset = data[1].sys.sunset;
      let moonPhase = data[3][0].Phase;
      let date = new Date();
      date.setTime(dtSunrise*1000);
      document.getElementById("cycle-rise-text").innerHTML = `${rightJustify(Math.floor(date.getUTCHours()+timezone)%24,2,"0")}:`
          +`${rightJustify((date.getUTCMinutes()+timezone*60)%60,2,"0")}`;
      date.setTime(dtSunset*1000);
      document.getElementById("cycle-set-text").innerHTML = `${rightJustify(Math.floor(date.getUTCHours()+timezone)%24,2,"0")}:`
          +`${rightJustify((date.getUTCMinutes()+timezone*60)%60,2,"0")}`;
      drawCycle(dtSunrise, dtSunset, moonPhase)
      clearInterval(cycleInterval);
      cycleInterval = setInterval(drawCycle, 60 * 1000, dtSunrise, dtSunset, moonPhase);
    })
    .catch(() => {
      console.log("Erreur serveur.");
    });
});
