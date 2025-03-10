import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { theme } from "../../utils/theme";
import "./ChatInterface.css";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { auth } from "../../firebase.config";
import { signOut } from "firebase/auth";

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

const apiUrl = import.meta.env.VITE_API_URL;

const ChatInterface = () => {
  const theme = useTheme();
  const [conversations, setConversations] = useState([
    { id: 1, title: "Start a new chat", messages: [initialMessage] },
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
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          messages: updatedMessages,
          systemPrompt: systemPrompt,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported");
      }

      const reader = response.body.getReader();
      let partialMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(5);
            if (data === "[DONE]") return;

            try {
              const { content, error } = JSON.parse(data);
              if (error) {
                throw new Error(error);
              }
              if (content) {
                partialMessage += content;
                updateCurrentConversation([
                  ...updatedMessages,
                  { role: "assistant", content: partialMessage },
                ]);
              }
            } catch (e) {
              console.error("Error parsing SSE:", e, "Raw data:", data);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      updateCurrentConversation([
        ...updatedMessages,
        {
          role: "assistant",
          content: `Error: ${error.message}. Please try again or contact support if the issue persists.`,
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("accessToken");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={createNewChat}>
          <ChatIcon /> Your Chats
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
          <button className="account-btn" onClick={() => navigate('/blogs')}>
            <UserIcon /> Blogs
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
                      ? theme.palette.background.paper
                      : theme.palette.primary.main,
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
                borderColor: theme.palette.primary.light,
                color: theme.palette.text.primary,
              }}
            />
            <button
              type="submit"
              className="send-button"
              disabled={isLoading || !input.trim()}
              style={{
                background: theme.palette.primary.main,
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
