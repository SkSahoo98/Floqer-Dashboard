import React, { useState, useRef, FormEvent } from "react";
import "./ChatApp.scss";
import { CommentOutlined } from "@ant-design/icons";
import axios from "axios";

interface Message {
  role: "user" | "bot";
  content: string;
}

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/ask", {
        query: input,
      });
      const botMessage: Message = {
        role: "bot",
        content: response.data.answer,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const errorMessage: Message = {
        role: "bot",
        content: "Error fetching response",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChatWindow = () => {
    setIsOpen(!isOpen);
  };

  

  return (
    <div className="app-container">
      <div className="chat-icon-container">
        <button type="button" onClick={toggleChatWindow}>
          <CommentOutlined className="antIcon" />
        </button>
      </div>

      {isOpen && (
        <div
          className={`chat-container ${isOpen ? "open" : ""}`}
          ref={chatContainerRef}
        >
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <span>{msg.content}</span>
              </div>
            ))}
            {loading && <div className="loading">Thinking...</div>}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me something..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
