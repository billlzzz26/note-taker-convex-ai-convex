import * as convex from "./convex";

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  execute: (args: unknown) => Promise<unknown>;
}

function parseArgs<T>(schema: ToolDefinition["inputSchema"], args: unknown): T {
  const a = args as Record<string, unknown>;
  for (const req of schema.required || []) {
    if (a[req] === undefined) {
      throw new Error(`Missing required field: ${req}`);
    }
  }
  return args as T;
}

export const tools: ToolDefinition[] = [
  {
    name: "save_note",
    description: "Save a new note with title, content, and optional tags",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Title of the note" },
        content: { type: "string", description: "Content of the note" },
        tags: { type: "array", items: { type: "string" }, description: "Tags for the note" },
      },
      required: ["title", "content"],
    },
    execute: async (args) => {
      const { title, content, tags = [] } = parseArgs<{ title: string; content: string; tags?: string[] }>(tools[0].inputSchema, args);
      const noteId = await convex.saveNote(title, content, tags);
      return { success: true, noteId, message: `Note "${title}" saved successfully` };
    },
  },
  {
    name: "search_notes",
    description: "Search notes by content or title",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Search query" },
      },
      required: ["search"],
    },
    execute: async (args) => {
      const { search } = parseArgs<{ search: string }>(tools[1].inputSchema, args);
      const notes = await convex.searchNotes(search);
      return { 
        success: true, 
        notes: notes.map(n => ({ id: n._id, title: n.title, content: n.content, tags: n.tags })),
        count: notes.length,
        message: `Found ${notes.length} note(s) matching "${search}"`
      };
    },
  },
  {
    name: "list_notes",
    description: "List all notes, sorted by most recent",
    inputSchema: {
      type: "object",
      properties: {},
    },
    execute: async () => {
      const notes = await convex.listNotes();
      return { 
        success: true, 
        notes: notes.map(n => ({ id: n._id, title: n.title, content: n.content, tags: n.tags, createdAt: n.createdAt })),
        count: notes.length,
        message: `Found ${notes.length} note(s)`
      };
    },
  },
  {
    name: "get_notes_by_tag",
    description: "Get all notes with a specific tag",
    inputSchema: {
      type: "object",
      properties: {
        tag: { type: "string", description: "Tag to search for" },
      },
      required: ["tag"],
    },
    execute: async (args) => {
      const { tag } = parseArgs<{ tag: string }>(tools[3].inputSchema, args);
      const notes = await convex.getNotesByTag(tag);
      return { 
        success: true, 
        tag,
        notes: notes.map(n => ({ id: n._id, title: n.title, content: n.content, tags: n.tags })),
        count: notes.length,
        message: `Found ${notes.length} note(s) with tag "${tag}"`
      };
    },
  },
  {
    name: "update_note",
    description: "Update an existing note's title, content, or tags",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID of the note to update" },
        title: { type: "string", description: "New title (optional)" },
        content: { type: "string", description: "New content (optional)" },
        tags: { type: "array", items: { type: "string" }, description: "New tags (optional)" },
      },
      required: ["id"],
    },
    execute: async (args) => {
      const { id, title, content, tags } = parseArgs<{ id: string; title?: string; content?: string; tags?: string[] }>(tools[4].inputSchema, args);
      await convex.updateNote(id, title, content, tags);
      return { success: true, noteId: id, message: `Note updated successfully` };
    },
  },
  {
    name: "delete_note",
    description: "Delete a note by its ID",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID of the note to delete" },
      },
      required: ["id"],
    },
    execute: async (args) => {
      const { id } = parseArgs<{ id: string }>(tools[5].inputSchema, args);
      await convex.deleteNote(id);
      return { success: true, noteId: id, message: `Note deleted successfully` };
    },
  },
];

export function getToolByName(name: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.name === name);
}
