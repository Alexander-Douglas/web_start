const mode = document.getElementById("mode-icon");
const html = document.querySelector("html");
const search = document.getElementById("search-bar");
var modeVal = false;

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
      document.getElementById("response").textContent = data;
    })
    .catch(() => {
      document.getElementById("response").textContent = "Erreur serveur.";
    });
});
