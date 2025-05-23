document.getElementById("submitBtn").addEventListener("click", () => {
  const password = document.getElementById("ville").value;
  console.log("Bouton touché")
  // Envoi la requête POST au backend Python
  fetch("/check-weather", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  })
    .then((response) => response.json()) // Réponse donnée
    .then((data) => { // Retour des données JSON en Objet JS
      console.log(data);
      document.getElementById("response").textContent = data.result;
    })
    .catch(() => {
      document.getElementById("response").textContent = "Erreur serveur.";
    });
});
