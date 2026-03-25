"use client";

import { useEffect, useState } from "react";
import { CONVEX_URL } from "../components/agents/lib/env";

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

interface NotesPanelProps {
  notes: Note[];
}

export function NotesPanel({ notes }: NotesPanelProps) {
  const [localNotes, setLocalNotes] = useState<Note[]>(notes);
  
  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  useEffect(() => {
    if (!CONVEX_URL) return;
    
    const eventSource = new EventSource(`${CONVEX_URL}/api/notes/subscribe`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.note) {
        setLocalNotes(prev => {
          const existing = prev.findIndex(n => n._id === data.note._id);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = data.note;
            return updated;
          }
          return [data.note, ...prev];
        });
      } else if (data.deletedId) {
        setLocalNotes(prev => prev.filter(n => n._id !== data.deletedId));
      }
    };
    
    return () => eventSource.close();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const tagColors: Record<string, string> = {
    High: "bg-red-900 text-red-200",
    Medium: "bg-yellow-900 text-yellow-200",
    Low: "bg-green-900 text-green-200",
    Work: "bg-blue-900 text-blue-200",
    Personal: "bg-purple-900 text-purple-200",
    Project: "bg-orange-900 text-orange-200",
    Meeting: "bg-cyan-900 text-cyan-200",
    Idea: "bg-pink-900 text-pink-200",
    Todo: "bg-indigo-900 text-indigo-200",
  };

  return (
    <div className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col h-full">
      <div className="p-3 border-b border-neutral-800">
        <h2 className="text-sm font-semibold text-white">Notes</h2>
        <p className="text-xs text-neutral-500">{localNotes.length} notes</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {localNotes.length === 0 ? (
          <p className="text-neutral-500 text-sm p-2">No notes yet. Ask me to save something!</p>
        ) : (
          <ul className="space-y-2">
            {localNotes.map((note) => (
              <li key={note._id} className="bg-neutral-800 rounded-lg p-3">
                <h3 className="text-sm font-medium text-white truncate">{note.title}</h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{note.content}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 text-xs rounded ${
                        tagColors[tag] || "bg-neutral-700 text-neutral-300"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-neutral-600 mt-2">{formatDate(note.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
