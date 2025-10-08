"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Smile } from "lucide-react";
import { toast } from "sonner";

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "System",
      text: "Welcome to the chat!",
      timestamp: new Date(),
      isSystem: true,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const newMessage = {
      id: messages.length + 1,
      user: "You",
      text: message,
      timestamp: new Date(),
      isSystem: false,
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate other user response
    setTimeout(() => {
      const responses = [
        "That's interesting!",
        "I agree!",
        "Nice one!",
        "Let's do this!",
        "Good point!",
      ];
      const response = {
        id: messages.length + 2,
        user: "Player 2",
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isSystem: false,
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date:Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all relative"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
          {!isOpen && messages.length > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
            >
              {messages.length - 1}
            </motion.div>
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-40 w-full max-w-sm"
          >
            <div className="bg-card rounded-2xl border-2 border-border shadow-2xl overflow-hidden flex flex-col h-[500px]">
              {/* Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-primary/5 border-b-2 border-border p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Room Chat</h3>
                    <p className="text-xs text-foreground/50">
                      {messages.length - 1} messages
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-foreground/60">Online</span>
                </div>
              </motion.div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/50">
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                      className={`flex ${
                        msg.user === "You" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          msg.isSystem
                            ? "w-full text-center"
                            : msg.user === "You"
                            ? ""
                            : ""
                        }`}
                      >
                        {msg.isSystem ? (
                          <div className="bg-foreground/5 text-foreground/60 text-xs py-2 px-3 rounded-full inline-block">
                            {msg.text}
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {msg.user !== "You" && (
                                <span className="text-xs font-medium text-foreground/70">
                                  {msg.user}
                                </span>
                              )}
                              <span className="text-xs text-foreground/40">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className={`rounded-2xl px-4 py-2.5 ${
                                msg.user === "You"
                                  ? "bg-primary text-primary-foreground rounded-br-sm"
                                  : "bg-foreground/10 text-foreground rounded-bl-sm"
                              }`}
                            >
                              <p className="text-sm break-words">{msg.text}</p>
                            </motion.div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="border-t-2 border-border p-4 bg-card"
              >
                <div className="flex gap-2 items-end">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyUp={handleKeyPress}
                      className="bg-background border-2 border-foreground/20 rounded-xl pr-10 text-foreground placeholder:text-foreground/40 focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                      maxLength={500}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/60 transition"
                      onClick={() => toast.info("Emoji picker coming soon!")}
                    >
                      <Smile className="h-5 w-5" />
                    </button>
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="h-10 w-10 p-0 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {message.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-foreground/40 mt-2"
                  >
                    {message.length}/500
                  </motion.p>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}