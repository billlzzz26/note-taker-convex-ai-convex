"use client";

import { useEffect, useState } from "react";
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
import { NotesList, type Note } from "@/components/ui/note-editor";
import { NoteEditorInline } from "@/components/ui/note-editor-inline";
import { NoteToolRenderers } from "./components/note-tool-renderers";
import { ThreePanelLayout } from "./components/three-panel-layout";
import { chat, type Message, type ToolCallResult } from "./components/agents/note-taker";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string; toolCalls?: ToolCallResult[] }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

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
        if (activeNote?._id === id) setActiveNote(null);
      }
    } catch (error) {
      console.error("Delete note error:", error);
    }
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
        .map((m) => ({ role: m.role, content: m.content }));
      conversationHistory.push({ role: "user", content: userMessage });

      const response = await chat(conversationHistory, () => {});
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.content, toolCalls: response.toolCalls },
      ]);
      if (response.toolCalls?.length) fetchNotes();
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error." },
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

  // Left panel: Notes list
  const notesSidebar = (
    <div className="flex h-full flex-col bg-neutral-900">
      <div className="flex items-center justify-between border-b border-neutral-800 p-3">
        <h2 className="text-sm font-semibold text-white">Notes</h2>
        <Button
          size="sm"
          onClick={() => setActiveNote(null)}
          className="gap-1 bg-[color:var(--accent-teal)] text-black hover:bg-[color:var(--accent-teal-dim)]"
        >
          <Plus className="size-3.5" />
          New
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <NotesList
          notes={notes}
          onEdit={(note) => setActiveNote(note)}
          onDelete={handleDeleteNote}
        />
      </div>
    </div>
  );

  // Center panel: Editor
  const editorPanel = (
    <NoteEditorInline
      note={activeNote}
      onSave={handleSaveNote}
    />
  );

  // Right panel: Chat
  const chatPanel = (
    <div className="flex h-full flex-col bg-neutral-950">
      <Conversation className="flex-1">
        <ConversationContent className="px-3 py-4">
          {messages.length === 0 ? (
            <ConversationEmptyState
              className="min-h-[40vh]"
              description="Ask me to remember something"
              title="Chat"
            >
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold text-white">Chat</h3>
                <p className="text-xs text-neutral-400">
                  Ask me to remember something, and I&apos;ll save it for you.
                </p>
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message, index) => (
              <div className="max-w-none mb-3" key={index}>
                <div
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl border border-[color:var(--accent-teal)]/20 bg-[color:var(--accent-teal)]/10 px-3 py-2 text-white text-sm"
                      : "w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 text-neutral-100 text-sm"
                  }
                >
                  <p className="whitespace-pre-wrap leading-6">{message.content}</p>
                  {message.toolCalls?.length ? (
                    <NoteToolRenderers toolCalls={message.toolCalls} />
                  ) : null}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-neutral-400 px-3 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[color:var(--accent-teal)]" />
              Thinking...
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-neutral-800 p-2">
        <PromptInput
          onSubmit={({ text }) => handleSendMessage(text)}
        >
          <PromptInputTextarea
            className="min-h-[44px] border-0 bg-transparent px-3 py-2 text-sm text-white placeholder:text-neutral-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something..."
            disabled={isLoading}
          />
          <div className="flex items-center justify-end border-t border-white/8 px-3 py-1.5">
            <PromptInputSubmit
              className="rounded-full bg-[color:var(--accent-teal)] text-black hover:bg-[color:var(--accent-teal-dim)]"
              disabled={!isLoading && !input.trim()}
              status={isLoading ? "submitted" : "ready"}
            />
          </div>
        </PromptInput>
      </div>
    </div>
  );

  return (
    <div className="h-screen">
      <ThreePanelLayout
        sidebar={notesSidebar}
        main={editorPanel}
        right={chatPanel}
        defaultPanel="main"
        onNewNote={() => setActiveNote(null)}
        onSearch={() => {}}
        onMenu={() => {}}
      />
    </div>
  );
}
