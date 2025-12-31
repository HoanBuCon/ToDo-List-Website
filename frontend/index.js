// GET
fetch("/api/mmb")
  .then(res => res.json())
  .then(data => {
    document.getElementById("sua").innerText = data.message;
  });

// POST
document.getElementById("sendBtn").addEventListener("click", () => {
  const text = document.getElementById("textInput").value;

  fetch("/api/mmb", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Response from server:", data);
  });
});
