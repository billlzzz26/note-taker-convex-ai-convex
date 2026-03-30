export interface ConvexNote {
  _id: string;
  _creationTime: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ConvexThread {
  _id: string;
  _creationTime: number;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  role: string;
  content: string;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
}

async function convexFetch<T>(action: string, args: Record<string, unknown>): Promise<T> {
  const response = await fetch("/api/convex", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, args }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Convex error: ${response.status} - ${error}`);
  }
  
  return response.json();
}

export async function listNotes(): Promise<ConvexNote[]> {
  return convexFetch("listNotes", {});
}

export async function getNote(id: string): Promise<ConvexNote | null> {
  return convexFetch("getNote", { id });
}

export async function searchNotes(search: string): Promise<ConvexNote[]> {
  return convexFetch("searchNotes", { search });
}

export async function getNotesByTag(tag: string): Promise<ConvexNote[]> {
  return convexFetch("getNotesByTag", { tag });
}

export async function saveNote(title: string, content: string, tags: string[]): Promise<string> {
  return convexFetch("saveNote", { title, content, tags });
}

export async function updateNote(
  id: string,
  title?: string,
  content?: string,
  tags?: string[]
): Promise<string> {
  return convexFetch("updateNote", { id, title, content, tags });
}

export async function deleteNote(id: string): Promise<string> {
  return convexFetch("deleteNote", { id });
}

export async function listThreads(): Promise<ConvexThread[]> {
  return convexFetch("listThreads", {});
}

export async function getThread(id: string): Promise<ConvexThread | null> {
  return convexFetch("getThread", { id });
}

export async function createThread(title: string): Promise<string> {
  return convexFetch("createThread", { title });
}

export async function addMessageToThread(
  threadId: string,
  role: string,
  content: string,
  toolCalls?: ToolCall[]
): Promise<string> {
  return convexFetch("addMessageToThread", {
    threadId,
    message: { role, content, toolCalls },
  });
}
