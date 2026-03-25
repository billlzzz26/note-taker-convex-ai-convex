import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listNotes = query({
  args: {},
  handler: async (ctx) => {
    const notes = await ctx.db
      .query("notes")
      .order("desc")
      .take(100);
    return notes;
  },
});

export const getNote = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    return note;
  },
});

export const searchNotes = query({
  args: { search: v.string() },
  handler: async (ctx, args) => {
    const allNotes = await ctx.db.query("notes").take(100);
    const searchLower = args.search.toLowerCase();
    return allNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower)
    );
  },
});

export const getNotesByTag = query({
  args: { tag: v.string() },
  handler: async (ctx, args) => {
    const allNotes = await ctx.db.query("notes").take(100);
    return allNotes.filter((note) => note.tags.includes(args.tag));
  },
});

export const saveNote = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const noteId = await ctx.db.insert("notes", {
      title: args.title,
      content: args.content,
      tags: args.tags,
      createdAt: now,
      updatedAt: now,
    });
    return noteId;
  },
});

export const updateNote = mutation({
  args: {
    id: v.id("notes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const note = await ctx.db.get(id);
    if (!note) {
      throw new Error("Note not found");
    }
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    return id;
  },
});

export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.id);
    if (!note) {
      throw new Error("Note not found");
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const listThreads = query({
  args: {},
  handler: async (ctx) => {
    const threads = await ctx.db
      .query("threads")
      .order("desc")
      .take(50);
    return threads;
  },
});

export const getThread = query({
  args: { id: v.id("threads") },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.id);
    return thread;
  },
});

export const createThread = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const threadId = await ctx.db.insert("threads", {
      title: args.title,
      messages: [],
      createdAt: now,
      updatedAt: now,
    });
    return threadId;
  },
});

export const addMessageToThread = mutation({
  args: {
    threadId: v.id("threads"),
    message: v.object({
      role: v.string(),
      content: v.string(),
      toolCalls: v.optional(v.any()),
    }),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    const messages = [...thread.messages, args.message];
    await ctx.db.patch(args.threadId, {
      messages,
      updatedAt: Date.now(),
    });
    return args.threadId;
  },
});
