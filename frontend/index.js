document.addEventListener("DOMContentLoaded", () => {

  // GET
  fetch("/api/mmb")
    .then(res => res.json())
    .then(data => {
      document.getElementById("sua").innerText = data.message;
    });

  // POST
  document.getElementById("sendBtn").addEventListener("click", () => {
    const text = document.getElementById("textInput").value;
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    console.log("Thông tin đã nhập:", text, email, password);

    fetch("/api/mmb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, email, password })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Response from server:", data);
    });
  });

});

// I changed something