import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  Bot,
  LoaderCircle,
  Brain,
  Wrench,
  MessageSquare,
  Trash2,
  Menu,
  X,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const useAuth = () => ({
  user: { fullname: "Municipal Manager", id: "manager_001" },
});

const Chat = () => {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(`${user.id}_${Date.now()}`);
  const [sessions, setSessions] = useState([]);
  const [showThoughtProcess, setShowThoughtProcess] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const scrollAreaRef = useRef(null);
  const eventSourceRef = useRef(null);

  const quickActions = [
    "Show unassigned reports",
    "Search water leak reports",
    "System status",
    "Assign nearby workers",
    "Today's completed tasks",
    "Streetlight reports",
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    loadActiveSessions();
    const currentRef = eventSourceRef.current;
    return () => {
      if (currentRef) currentRef.close();
    };
  }, []);
  useEffect(() => {
    console.log("Messages state updated:", JSON.stringify(messages, null, 2));
  }, [messages]);

  const loadActiveSessions = async () => {
    try {
      const response = await fetch("http://localhost:5000/sessions/active");
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  };
  const visibleMessages = useMemo(() => {
    // This function removes the specific duplicate user message pattern found in the logs.
    return messages.reduce((acc, currentMsg) => {
      // If the accumulator (our clean array) has fewer than 2 messages, there's no pattern to check.
      if (acc.length < 2) {
        acc.push(currentMsg);
        return acc;
      }

      const lastMsg = acc[acc.length - 1];
      const secondToLastMsg = acc[acc.length - 2];

      // Check for the buggy pattern: [User, AI, User] where the two User messages are identical.
      if (
        currentMsg.sender === "user" &&
        lastMsg.sender === "ai" &&
        secondToLastMsg.sender === "user" &&
        currentMsg.text === secondToLastMsg.text
      ) {
        // This is the duplicate user message shown in the log. We skip it by not adding it to the accumulator.
        return acc;
      }

      // If the pattern is not found, add the current message to our clean array.
      acc.push(currentMsg);
      return acc;
    }, []);
  }, [messages]);

  // REPLACE your entire handleParsedEvent function with this correct version:
  const handleParsedEvent = useCallback((parsed, aiMessageId) => {
    switch (parsed.type) {
      case "thinking":
      case "tool_start":
      case "tool_end": {
        // This is the CORRECT logic for "thinking" and tool events.
        // It adds a step to the "thoughtProcess" array for the UI.
        const thoughtStep = {
          type: parsed.type,
          content: parsed.content || `${parsed.tool}: ${parsed.input}` || parsed.output || "",
          tool: parsed.tool,
          timestamp: new Date(),
        };
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId
              ? {
                  ...m,
                  thoughtProcess: [...(m.thoughtProcess || []), thoughtStep],
                }
              : m
          )
        );
        break;
      }
      case "token":
        // This is the CORRECT logic for streaming message text.
        // It appends the incoming token to the message's `text` property.
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMessageId ? { ...m, text: m.text + parsed.content } : m))
        );
        break;

      case "heartbeat":
        break;
      default:
        console.log("Unknown SSE type:", parsed.type);
    }
  }, []);

  const streamMessage = useCallback(
    async (messageText) => {
      if (!messageText.trim() || isLoading) return;

      setShowInput(false);
      setIsLoading(true);

      const userMessage = {
        id: `user_${Date.now()}`,
        sender: "user",
        text: messageText.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      const aiMessageId = `ai_${Date.now()}`;
      const aiMessage = {
        id: aiMessageId,
        sender: "ai",
        text: "",
        timestamp: new Date(),
        isStreaming: true,
        thoughtProcess: [],
      };

      setMessages((prev) => [...prev, aiMessage]);

      try {
        await fetchEventSource("http://localhost:5000/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageText.trim(),
            session_id: currentSessionId,
          }),

          onmessage(ev) {
            if (ev.data === "[DONE]") {
              setMessages((prev) =>
                prev.map((m) => (m.id === aiMessageId ? { ...m, isStreaming: false } : m))
              );
              setIsLoading(false);
              return;
            }
            const parsed = JSON.parse(ev.data);
            handleParsedEvent(parsed, aiMessageId);
          },

          onerror(err) {
            console.error("SSE error", err);
            throw err;
          },
        });
      } catch (error) {
        console.error("Streaming failed:", error);
        try {
          const fallbackResponse = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: messageText.trim(),
              session_id: currentSessionId,
            }),
          });

          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? {
                      ...msg,
                      text: data.response || "Sorry, I couldn't process your request.",
                      isStreaming: false,
                    }
                  : msg
              )
            );
          } else {
            throw new Error("Fallback also failed");
          }
        } catch {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    text: "Sorry, I'm having trouble connecting to the server. Please make sure it's running and try again.",
                    isStreaming: false,
                  }
                : msg
            )
          );
        }
      } finally {
        setIsLoading(false);
        setInputValue("");
        loadActiveSessions();
      }
    },
    [currentSessionId, isLoading, handleParsedEvent]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    streamMessage(inputValue);
  };

  const handleQuickAction = (action) => {
    streamMessage(action);
  };

  const createNewChat = () => {
    const newSessionId = `${user.id}_${Date.now()}`;
    setCurrentSessionId(newSessionId);
    setMessages([]);
    setShowInput(true);
    setInputValue("");
    setIsLoading(false);
  };

  const loadSession = async (sessionId) => {
    try {
      const response = await fetch(`http://localhost:5000/chat/history/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        const loadedMessages = data.history.map((msg, index) => ({
          id: `${msg.role}_${sessionId}_${index}`,
          sender: msg.role === "human" ? "user" : "ai",
          text: msg.content,
          timestamp: new Date(msg.timestamp),
        }));

        setMessages(loadedMessages);
        setCurrentSessionId(sessionId);
        setShowInput(false);
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    }
  };

  const clearSession = async (sessionId) => {
    try {
      await fetch(`http://localhost:5000/chat/history/${sessionId}`, {
        method: "DELETE",
      });
      loadActiveSessions();
      if (sessionId === currentSessionId) {
        createNewChat();
      }
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  };

  const ThoughtProcessDisplay = ({ thoughtProcess }) => {
    if (!showThoughtProcess || !thoughtProcess?.length) return null;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="mb-2 p-2 bg-muted/30 rounded-md border text-xs"
      >
        <div className="flex items-center gap-1 mb-1">
          <Brain className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Thinking</span>
        </div>
        <div className="space-y-1">
          {thoughtProcess.map((step, index) => (
            <div key={index} className="flex items-center gap-1 text-xs">
              {step.type === "thinking" && <Brain className="w-2 h-2 text-blue-500" />}
              {step.type === "tool_start" && <Wrench className="w-2 h-2 text-orange-500" />}
              {step.type === "tool_end" && <Wrench className="w-2 h-2 text-green-500" />}
              <span className="text-muted-foreground truncate">{step.content}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.sender === "user";
    return (
      <div className={`flex w-full mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`flex items-end gap-2 max-w-xs ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/30 to-primary/20 flex items-center justify-center flex-shrink-0">
            {isUser ? (
              <User className="w-2.5 h-2.5 text-primary" />
            ) : (
              <Bot className="w-2.5 h-2.5 text-primary" />
            )}
          </div>
          <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
            {!isUser && <ThoughtProcessDisplay thoughtProcess={message.thoughtProcess || []} />}
            <Card
              className={`rounded-lg px-2.5 py-1.5 text-sm max-w-lg ${
                isUser
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted text-muted-foreground mr-auto"
              }`}
            >
              <div className="flex items-center gap-1 mb-0.5">
                {message.isStreaming && <LoaderCircle className="w-2.5 h-2.5 animate-spin" />}
                {!isUser && message.thoughtProcess?.length > 0 && (
                  <Badge variant="secondary" className="text-xs h-3 px-1">
                    AI
                  </Badge>
                )}
              </div>

              {/* Fixed React Markdown */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ children }) => (
                    <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                      {children}
                    </p>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {children}
                    </a>
                  ),
                  li: ({ children }) => <li className="ml-4 list-disc text-xs">{children}</li>,
                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-xs">
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto">
                        <code>{children}</code>
                      </pre>
                    ),
                  table: ({ ...props }) => (
                    <table
                      className="w-full my-2 border-collapse border border-slate-500"
                      {...props}
                    />
                  ),
                  thead: ({ ...props }) => (
                    <thead className="bg-slate-200 dark:bg-slate-800" {...props} />
                  ),
                  th: ({ ...props }) => (
                    <th className="border border-slate-400 p-1.5 text-left text-xs" {...props} />
                  ),
                  td: ({ ...props }) => (
                    <td className="border border-slate-400 p-1.5 align-top text-xs" {...props} />
                  ),
                }}
              >
                {message.text}
              </ReactMarkdown>

              {message.isStreaming && <span className="animate-pulse">|</span>}

              <div className={`text-xs mt-0.5 opacity-60 ${isUser ? "text-right" : "text-left"}`}>
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-background text-foreground flex font-sans overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-0" : "w-72"
        } transition-all duration-300 border-r bg-muted/20 flex flex-col h-screen overflow-hidden`}
      >
        <div className={`${sidebarCollapsed ? "hidden" : "block"} p-4 border-b flex-shrink-0`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">Sessions</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(true)}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          <Button onClick={createNewChat} className="w-full h-8 text-xs">
            <MessageSquare className="w-3 h-3 mr-1" />
            New Chat
          </Button>
        </div>

        <ScrollArea className={`${sidebarCollapsed ? "hidden" : "flex-1 min-h-0"}`}>
          <div className="p-2 space-y-1">
            {sessions.map((session) => (
              <div
                key={session.session_id}
                className={`group flex items-center justify-between p-2 rounded-md cursor-pointer text-xs transition-colors ${
                  session.session_id === currentSessionId
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
                onClick={() => loadSession(session.session_id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    Session {session.session_id.split("_").pop()}
                  </p>
                  <p className="text-xs text-muted-foreground">{session.message_count} msgs</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSession(session.session_id);
                  }}
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className={`${sidebarCollapsed ? "hidden" : "block"} p-3 border-t flex-shrink-0`}>
          <div className="flex items-center justify-between text-xs">
            <label>Thought Process</label>
            <input
              type="checkbox"
              checked={showThoughtProcess}
              onChange={(e) => setShowThoughtProcess(e.target.checked)}
              className="w-3 h-3"
            />
          </div>
        </div>
      </div>

      {/* Sidebar toggle button when collapsed */}
      {sidebarCollapsed && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(false)}
          className="absolute top-4 left-4 z-50 h-8 w-8 p-0"
        >
          <Menu className="w-4 h-4" />
        </Button>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {showInput ? (
            <motion.div
              key="input-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center flex-1 p-4"
            >
              <div className="w-full max-w-2xl text-center">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent text-center">
                  CivicLink Assistant
                </h1>
                <p className="text-base text-muted-foreground mb-8 text-center">
                  Hi {user?.fullname || "Manager"}, ready to help with municipal management!
                </p>

                <form onSubmit={handleSubmit} className="mb-6">
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Ask me anything..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="flex-1 h-10 text-sm rounded-full"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="rounded-full h-10 w-10"
                      disabled={!inputValue.trim() || isLoading}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>

                <div className="flex flex-wrap justify-center gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="rounded-full text-xs h-7"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full min-h-0"
            >
              {/* Chat header */}
              <div className="border-b bg-background/90 backdrop-blur-sm p-3 flex items-center justify-between flex-shrink-0">
                <div className="text-center flex-1">
                  <h2 className="text-lg font-bold">CivicLink Assistant</h2>
                  <p className="text-xs text-muted-foreground">
                    Session: {currentSessionId.split("_").pop()}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea
                ref={scrollAreaRef}
                className="flex-1 px-3 py-4 space-y-2 overflow-y-auto"
              >
                <AnimatePresence>
                  {visibleMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MessageBubble message={msg} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>

              {/* Input area */}
              <form
                onSubmit={handleSubmit}
                className="p-3 border-t bg-background/80 backdrop-blur-sm flex items-center gap-2 flex-shrink-0"
              >
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 text-sm rounded-full"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full h-9 w-9"
                  disabled={!inputValue.trim() || isLoading}
                >
                  {isLoading ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Chat;
