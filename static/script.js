const mode = document.getElementById("mode-icon");
const html = document.querySelector("html");
const search = document.getElementById("search-bar");
let modeVal = false;

let scale = screen.width/1350;
document.querySelector('meta[name="viewport"]').setAttribute('content', "width='1350', initial-scale='+scale+'");

mode.addEventListener("click", () => {
  modeVal = !modeVal;
  console.log(modeVal);
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
setInterval(() => {}, 1000);

// Tous les heures, remettre à jour la position de l'astre
setInterval(() => {}, 3600 * 1000);

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
  body = document.getElementById("cycle-body");
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

posCircle(0.5,0)

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
    })
    .catch(() => {
      console.log("Erreur serveur.");
    });
});
