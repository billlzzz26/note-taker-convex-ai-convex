"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { ThreadSidebar } from "./components/thread-sidebar";
import { NotesPanel } from "./components/notes-panel";
import { NoteToolRenderers } from "./components/note-tool-renderers";
import { chat, type Message, type ToolCallResult } from "./components/agents/note-taker";
import { type Note } from "@/components/ui/note-editor";
import { MessageSquare, StickyNote, Menu } from "lucide-react";

interface Thread {
  id: string;
  title: string;
}

type MobileView = "chat" | "notes" | "menu";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string; toolCalls?: ToolCallResult[] }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [mobileView, setMobileView] = useState<MobileView>("chat");

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    fetchNotes();
  }, []);

  // On resize to desktop, reset mobile overlay
  useEffect(() => {
    if (isDesktop) setMobileView("chat");
  }, [isDesktop]);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes", {
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
    if (!isDesktop) setMobileView("chat");
  };

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    if (!isDesktop) setMobileView("chat");
  };

  const handleSendMessage = async (rawMessage?: string) => {
    const userMessage = (rawMessage ?? input).trim();
    if (!userMessage || isLoading) return;

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
          content: "Sorry, I encountered an error. Please check the server-side note API configuration.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async (data: Partial<Note>) => {
    const action = data._id ? "updateNote" : "saveNote";
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, args: data }),
      });
      if (response.ok) {
        await fetchNotes();
      }
    } catch (error) {
      console.error("Save note error:", error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteNote", args: { _id: id } }),
      });
      if (response.ok) {
        await fetchNotes();
      }
    } catch (error) {
      console.error("Delete note error:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const showSidebar = isDesktop || mobileView === "menu";
  const showNotes = isDesktop || (!isTablet && mobileView === "notes") || (isTablet && !isDesktop);

  return (
    <div className="flex h-screen bg-neutral-950">
      {/* Sidebar — desktop: always visible, mobile/tablet: overlay */}
      {showSidebar && (
        <div
          className={
            isDesktop
              ? "hidden lg:block"
              : "fixed inset-0 z-50 flex"
          }
        >
          {/* Mobile overlay backdrop */}
          {!isDesktop && (
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileView("chat")}
            />
          )}
          <div className={isDesktop ? "" : "relative w-72"}>
            <ThreadSidebar
              threads={threads}
              activeThreadId={activeThreadId}
              onSelectThread={handleSelectThread}
              onNewThread={handleNewThread}
              onClose={() => setMobileView("chat")}
              isMobileOverlay={!isDesktop}
            />
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Conversation className="flex-1 bg-neutral-950">
          <ConversationContent className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-4 sm:py-6">
            {messages.length === 0 ? (
              <ConversationEmptyState
                className="min-h-[50vh]"
                description="Ask me to remember something, and I'll save it for you."
                title="Note Taker"
              >
                <div className="space-y-3 text-center">
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Note Taker</h1>
                  <p className="text-sm text-neutral-400">
                    Ask me to remember something, and I&apos;ll save it for you.
                  </p>
                  <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">
                    Try: &quot;Remember my meeting is at 2pm Tuesday&quot;
                  </p>
                </div>
              </ConversationEmptyState>
            ) : (
              messages.map((message, index) => (
                <div className="max-w-none" key={index}>
                  <div
                    className={
                      message.role === "user"
                        ? "ml-auto max-w-[85%] rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-white"
                        : "w-full rounded-3xl border border-white/8 bg-white/[0.03] px-4 sm:px-5 py-4 text-neutral-100 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur"
                    }
                  >
                    <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>
                    {message.toolCalls && message.toolCalls.length > 0 && (
                      <NoteToolRenderers toolCalls={message.toolCalls} />
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="max-w-none">
                <div className="rounded-3xl border border-white/8 bg-white/[0.03] px-4 sm:px-5 py-4 text-neutral-200 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur">
                  <div className="flex items-center gap-3 text-sm text-neutral-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-neutral-800 p-3 sm:p-4">
          <PromptInput
            className="mx-auto max-w-4xl"
            onSubmit={({ text }) => handleSendMessage(text)}
          >
            <PromptInputTextarea
              className="min-h-[48px] sm:min-h-[64px] border-0 bg-transparent px-3 sm:px-4 py-3 text-sm leading-6 text-white placeholder:text-neutral-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={isLoading}
            />
            <div className="flex items-center justify-between border-t border-white/8 px-3 py-2">
              <p className="hidden sm:block text-xs uppercase tracking-[0.22em] text-neutral-500">
                {isLoading ? "Assistant is working" : "Enter to send, Shift+Enter for newline"}
              </p>
              <PromptInputSubmit
                className="rounded-full bg-cyan-400 text-black hover:bg-cyan-300"
                disabled={!isLoading && !input.trim()}
                status={isLoading ? "submitted" : "ready"}
              />
            </div>
          </PromptInput>
        </div>

        {/* Mobile bottom tab bar */}
        {!isDesktop && (
          <nav className="flex border-t border-neutral-800 bg-neutral-900">
            <button
              onClick={() => setMobileView("menu")}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                mobileView === "menu" ? "text-cyan-400" : "text-neutral-500"
              }`}
            >
              <Menu className="w-5 h-5" />
              Menu
            </button>
            <button
              onClick={() => setMobileView("chat")}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                mobileView === "chat" ? "text-cyan-400" : "text-neutral-500"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Chat
            </button>
            <button
              onClick={() => setMobileView("notes")}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                mobileView === "notes" ? "text-cyan-400" : "text-neutral-500"
              }`}
            >
              <StickyNote className="w-5 h-5" />
              Notes
            </button>
          </nav>
        )}
      </div>

      {/* Notes panel — desktop: always visible, tablet: always visible, mobile: overlay */}
      {showNotes && !isDesktop && isTablet && (
        <NotesPanel notes={notes} onSave={handleSaveNote} onDelete={handleDeleteNote} />
      )}
      {!isDesktop && !isTablet && mobileView === "notes" && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileView("chat")}
          />
          <div className="relative w-full max-w-sm">
            <NotesPanel
              notes={notes}
              onSave={handleSaveNote}
              onDelete={handleDeleteNote}
              onClose={() => setMobileView("chat")}
              isMobileOverlay
            />
          </div>
        </div>
      )}
      {isDesktop && (
        <NotesPanel notes={notes} onSave={handleSaveNote} onDelete={handleDeleteNote} />
      )}
    </div>
  );
}
