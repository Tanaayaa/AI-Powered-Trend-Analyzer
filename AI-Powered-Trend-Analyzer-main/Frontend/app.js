document.getElementById("sendButton").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const inputBox = document.getElementById("userInput");
  const userText = inputBox.value.trim();

  if (userText) {
    displayMessage(userText, "user-message");
    inputBox.value = "";

    try {
      const response = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText }),
      });

      if (response.ok) {
        const data = await response.json();
        displayMessage(data.response, "bot-message");
        if (data.sources && data.sources.length > 0) {
          displayMessage("Sources: " + data.sources.join(", "), "source-message");
        }
      } else {
        const errorData = await response.json().catch(() => null);
        displayMessage(
          errorData?.error || "Error: Unable to get response from server.",
          "bot-message"
        );
      }
    } catch (error) {
      displayMessage("Error: Server is unreachable.", "bot-message");
    }
  }
}

function displayMessage(text, className) {
  const chatBox = document.getElementById("chatBox");
  const message = document.createElement("div");
  message.classList.add("message", className);
  message.innerText = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}
