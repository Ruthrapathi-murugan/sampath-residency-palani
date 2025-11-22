import { useState, useRef } from "react";
import axios from "axios";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

const ChatWindow = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newHistory = [...messages, userMessage];

    setMessages(newHistory);

    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
        history: newHistory,
      });

      const botReply = res.data.reply;

      const assistantMessage = { role: "assistant", content: botReply };
      setMessages((prev) => [...prev, assistantMessage]);

      // Speak the reply
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(botReply);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error contacting server." },
      ]);
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="chat-container">
      <h2>Sampath Residency – AI Assistant</h2>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.role === "user" ? "user" : "bot"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="input-row">
        <button onClick={startListening}>
          {listening ? "Stop 🎙️" : "Speak 🎤"}
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about Sampath Residency..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send ➤</button>
      </div>
    </div>
  );
};

export default ChatWindow;
