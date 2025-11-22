import React, { useState, useRef } from "react";
import axios from "axios";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");

    try {
      const res = await axios.post("https://backend-sampath-residency.onrender.com/api/chat", {
        message: userMessage.content,
        history: newHistory,
      });

      const botReply = res.data.reply || "Sorry, I couldn't respond.";

      const assistantMessage = { role: "assistant", content: botReply };
      setMessages((prev) => [...prev, assistantMessage]);

      // Voice output
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(botReply);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error contacting server. Please try again.",
        },
      ]);
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current && recognitionRef.current.stop();
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
    <div className="sr-chatbot-launcher">
      {/* Chat panel */}
      {isOpen && (
        <div className="sr-chatbot-panel">
          <div className="sr-chatbot-header">
            <div>
              <div className="sr-chatbot-title">Sampath Residency Assistant</div>
              <div className="sr-chatbot-subtitle">
                Ask about rooms, check-in, temple, etc.
              </div>
            </div>
            <button className="sr-chatbot-close" onClick={toggleChat}>
              ✕
            </button>
          </div>

          <div className="sr-chat-container">
            <div className="sr-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`sr-message ${
                    msg.role === "user" ? "sr-user" : "sr-bot"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <div className="sr-input-row">
              <button
                type="button"
                className="sr-mic-btn"
                onClick={startListening}
              >
                {listening ? "Stop 🎙️" : "Mic 🎤"}
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Sampath Residency..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button type="button" className="sr-send-btn" onClick={sendMessage}>
                Send ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button className="sr-chatbot-fab" onClick={toggleChat}>
        💬
      </button>
    </div>
  );
};

export default ChatBot;
