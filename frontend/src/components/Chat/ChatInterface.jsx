import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { theme } from "../../utils/theme";
import "./ChatInterface.css";
import { useNavigate } from "react-router-dom";

// Icons (you can replace these with actual SVG icons)
const ChatIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const SendIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
  </svg>
);

const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const systemPrompt = `You are an advanced AI assistant specializing in both business consulting and IT project management. Your capabilities include:

Business Consulting:
- Strategic planning and business model analysis
- Market research and competitive analysis
- Financial modeling and forecasting
- Process optimization and organizational design
- Risk assessment and mitigation strategies

IT Project Management:
- Technical architecture design
- Project planning and estimation
- Agile/Scrum methodology implementation
- Technology stack selection
- Code review and best practices
- System integration planning

You provide clear, actionable advice based on industry best practices and real-world experience.`;

const initialMessage = {
  role: "assistant",
  content:
    "👋 Hello! I'm your AI Business and Technology Advisor. I can help you with: Business Strategy, Market Analysis, Technical Architecture, Project Management, How can I assist you today?",
};

const ChatInterface = () => {
  const [conversations, setConversations] = useState([
    { id: 1, title: "New Chat", messages: [initialMessage] },
  ]);
  const [currentConversation, setCurrentConversation] = useState(1);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
    }
  }, [navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentConversation]);

  const createNewChat = () => {
    const newId = Math.max(...conversations.map((c) => c.id)) + 1;
    const newChat = {
      id: newId,
      title: "New Chat",
      messages: [initialMessage],
    };
    setConversations([...conversations, newChat]);
    setCurrentConversation(newId);
  };

  const getCurrentMessages = () => {
    return (
      conversations.find((c) => c.id === currentConversation)?.messages || []
    );
  };

  const updateCurrentConversation = (messages) => {
    setConversations((convs) =>
      convs.map((conv) =>
        conv.id === currentConversation
          ? {
              ...conv,
              messages,
              title: messages[1]?.content.slice(0, 30) + "...",
            }
          : conv
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const currentMessages = getCurrentMessages();
    const updatedMessages = [...currentMessages, userMessage];
    updateCurrentConversation(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          systemPrompt: "You are a helpful business and technology advisor.",
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const reader = response.body.getReader();
      let partialMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        lines.forEach((line) => {
          if (line.startsWith("data: ")) {
            const data = line.slice(5);
            if (data === "[DONE]") return;

            try {
              const { content } = JSON.parse(data);
              partialMessage += content;
              updateCurrentConversation([
                ...updatedMessages,
                { role: "assistant", content: partialMessage },
              ]);
            } catch (e) {
              console.error("Error parsing SSE:", e);
            }
          }
        });
      }
    } catch (error) {
      console.error("Error:", error);
      updateCurrentConversation([
        ...updatedMessages,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={createNewChat}>
          <ChatIcon /> New Chat
        </button>
        <div className="conversations-list">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={
                "conversation-item" +
                (conv.id === currentConversation ? " active" : "")
              }
              onClick={() => setCurrentConversation(conv.id)}
            >
              <ChatIcon />
              {conv.title}
            </div>
          ))}
        </div>
        <div className="user-section">
          <button className="account-btn">
            <UserIcon /> Account
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      <main className="chat-main">
        <div className="chat-container">
          <div className="chat-messages">
            {getCurrentMessages().map((message, index) => (
              <div
                key={index}
                className={"message " + message.role}
                style={{
                  background:
                    message.role === "assistant"
                      ? theme.colors.background.paper
                      : theme.colors.gradient.primary,
                }}
              >
                <div className="message-content">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="loading-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="chat-input-container">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about business or technology..."
              className="chat-input"
              style={{
                borderColor: theme.colors.primary.light,
                color: theme.colors.text.primary,
              }}
            />
            <button
              type="submit"
              className="send-button"
              disabled={isLoading || !input.trim()}
              style={{
                background: theme.colors.gradient.primary,
              }}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;
