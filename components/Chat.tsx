"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface ChatProps {
  matchId: string;
  matchedUserName: string;
  matchedUserImage?: string;
  currentUserId: string;
}

export default function Chat({ matchId, matchedUserName, matchedUserImage, currentUserId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    isRateLimited: boolean;
    remainingTime: number;
  }>({
    isRateLimited: false,
    remainingTime: 0,
  });
  const [rateLimitTimer, setRateLimitTimer] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?matchId=${matchId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data.messages);
    } catch (err) {
      setError("Error loading messages");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [matchId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (rateLimitTimer) {
        clearInterval(rateLimitTimer);
      }
    };
  }, [rateLimitTimer]);

  // Handle rate limit countdown
  const startRateLimitCountdown = (seconds: number) => {
    setRateLimitInfo({
      isRateLimited: true,
      remainingTime: seconds,
    });

    // Clear any existing timer
    if (rateLimitTimer) {
      clearInterval(rateLimitTimer);
    }

    // Start countdown
    const timer = setInterval(() => {
      setRateLimitInfo((prev) => {
        if (prev.remainingTime <= 1) {
          clearInterval(timer);
          return { isRateLimited: false, remainingTime: 0 };
        }
        return { ...prev, remainingTime: prev.remainingTime - 1 };
      });
    }, 1000);

    setRateLimitTimer(timer);
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || rateLimitInfo.isRateLimited) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId,
          content: newMessage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit exceeded
          startRateLimitCountdown(result.remainingTime || 60);
          throw new Error(result.error || "You're sending messages too quickly. Please wait.");
        }
        throw new Error("Failed to send message");
      }

      setMessages([...messages, result.message]);
      setNewMessage("");
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] rounded-lg shadow-sm">
      {/* Messages container */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`max-w-[75%] mb-2 ${
                  isOwnMessage ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    isOwnMessage
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border-slate-200"
                  }`}
                >
                  {message.content}
                </div>
                <p
                  className={`text-xs mt-1 text-gray-500 ${
                    isOwnMessage ? "text-right" : "text-left"
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={sendMessage} className="p-3 border-slate-200 bg-white">
        {error && (
          <div className="mb-2 p-2 text-sm text-red-500 bg-red-50 rounded">
            {error}
          </div>
        )}
        {rateLimitInfo.isRateLimited && (
          <div className="mb-2 p-2 text-sm text-amber-700 bg-amber-50 rounded">
            Please wait {rateLimitInfo.remainingTime} seconds before sending another message.
          </div>
        )}
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || rateLimitInfo.isRateLimited}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {rateLimitInfo.isRateLimited 
              ? `Wait (${rateLimitInfo.remainingTime}s)` 
              : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}