"use client";

import { useState, useRef, useEffect } from "react";
import { ThreadSidebar } from "./components/thread-sidebar";
import { NotesPanel } from "./components/notes-panel";
import { NoteToolRenderers } from "./components/note-tool-renderers";
import { chat, type Message, type ToolCallResult } from "./components/agents/note-taker";
import { CONVEX_URL } from "./components/agents/lib/env";

interface Thread {
  id: string;
  title: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string; toolCalls?: ToolCallResult[] }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchNotes = async () => {
    if (!CONVEX_URL) return;
    try {
      const response = await fetch(`${CONVEX_URL}/api/listNotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "listNotes", args: {} }),
      });
      if (response.ok) {
        const data = await response.json();
        setNotes(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const handleNewThread = () => {
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      title: `New Chat ${threads.length + 1}`,
    };
    setThreads([newThread, ...threads]);
    setActiveThreadId(newThread.id);
    setMessages([]);
  };

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    const newUserMessage = { role: "user" as const, content: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const conversationHistory: Message[] = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));
      conversationHistory.push({ role: "user", content: userMessage });

      const response = await chat(
        conversationHistory,
        () => {}
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.content,
          toolCalls: response.toolCalls,
        },
      ]);

      if (response.toolCalls && response.toolCalls.length > 0) {
        fetchNotes();
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please check that the Convex URL is configured in your environment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-neutral-950">
      <ThreadSidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={handleSelectThread}
        onNewThread={handleNewThread}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-white mb-2">Note Taker</h1>
                <p className="text-neutral-400">Ask me to remember something, and I&apos;ll save it for you.</p>
                <p className="text-neutral-500 text-sm mt-2">Try: &quot;Remember my meeting is at 2pm Tuesday&quot;</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-neutral-800 text-neutral-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <NoteToolRenderers toolCalls={message.toolCalls} />
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-neutral-800 rounded-lg px-4 py-2">
                <p className="text-neutral-400 animate-pulse">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t border-neutral-800 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <NotesPanel notes={notes} />
    </div>
  );
}
