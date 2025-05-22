document.getElementById("submitBtn").addEventListener("click", () => {
  const password = document.getElementById("ville").value;

  // Envoi la requête POST au backend Python
  fetch("/check-weather", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  })
    .then((response) => response.json();console.log("Réponse donné"))
    .then((data) => {
      console.log(data.result)
      document.getElementById("response").textContent = data.result;
    })
    .catch(() => {
      document.getElementById("response").textContent = "Erreur serveur.";
    });
});
