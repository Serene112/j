chatbotInput.addEventListener("keypress", async function(e) {
  if (e.key === "Enter" && chatbotInput.value.trim() !== "") {
    const userMessage = chatbotInput.value.trim();
    appendMessage("You", userMessage);
    chatbotInput.value = "";

    let botReply = "Sorry, I didn't understand that.";

    try {
      // Fetch all documents from the chatbot collection
      const snapshot = await db.collection("chatbot").get();

      if (snapshot.empty) {
        console.log("No documents found in chatbot collection.");
      } else {
        snapshot.forEach(doc => {
          const data = doc.data();
          console.log("Checking document:", data); // Debug log

          // If your Firestore uses a "replies" map in a single document:
          if (data.replies) {
            for (let key in data.replies) {
              if (userMessage.toLowerCase().includes(key.toLowerCase())) {
                botReply = data.replies[key];
              }
            }
          }

          // If your Firestore has individual documents with question/answer fields:
          if (data.question && data.answer) {
            if (userMessage.toLowerCase().includes(data.question.toLowerCase())) {
              botReply = data.answer;
            }
          }
        });
      }
    } catch (err) {
      console.error("Error fetching chatbot data:", err);
      botReply = "Sorry, there was an error retrieving the answer.";
    }

    // Show bot response with a slight delay
    setTimeout(() => appendMessage("Bot", botReply), 500);
  }
});
