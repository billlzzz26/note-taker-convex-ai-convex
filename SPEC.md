# Note Taker with Convex - Specification

## Project Overview

- **Project Name**: Note Taker
- **Type**: AI-powered notebook application with real-time sync
- **Core Functionality**: An AI assistant that helps users create, search, update, and delete notes with persistent storage via Convex and real-time synchronization
- **Target Users**: Anyone who wants an AI-powered note-taking assistant that works across sessions

## UI/UX Specification

### Layout Structure

**Three-Panel Layout**:
- **Left Panel (Thread Sidebar)**: 14rem (w-56) - Navigation for conversation threads
- **Center Panel (Chat)**: flex-1 - Main chat interface with AI
- **Right Panel (Notes Panel)**: 20rem (w-80) - Real-time notes display with Convex subscriptions

### Responsive Breakpoints
- Desktop (≥1024px): Full three-panel layout
- Tablet (768-1023px): Collapsible sidebar, two panels visible
- Mobile (<768px): Single panel with tab navigation

### Visual Design

**Color Palette**:
- Background Primary: `#0a0a0a` (near black)
- Background Secondary: `#171717` (dark gray)
- Background Tertiary: `#262626` (lighter gray)
- Border: `#404040` (subtle gray)
- Text Primary: `#fafafa` (off-white)
- Text Secondary: `#a3a3a3` (muted gray)
- Accent Primary: `#3b82f6` (blue-500)
- Accent Hover: `#2563eb` (blue-600)
- Success: `#22c55e` (green-500)
- Warning: `#f59e0b` (amber-500)
- Error: `#ef4444` (red-500)

**Typography**:
- Font Family: System UI (San Francisco, -apple-system, BlinkMacSystemFont, Segoe UI)
- Heading Large: 1.5rem (24px), font-semibold
- Heading Medium: 1.125rem (18px), font-medium
- Body: 0.875rem (14px), font-normal
- Small: 0.75rem (12px), font-normal

**Spacing System**:
- Base unit: 4px
- Common spacing: 8px, 12px, 16px, 24px, 32px

**Visual Effects**:
- Border radius: 8px (cards), 6px (buttons), 4px (inputs)
- Box shadows: Subtle shadow for elevated elements
- Transitions: 150ms ease for hover states
- Scrollbar: Custom styled, thin, subtle

### Components

**Thread Sidebar**:
- Thread list with active indicator
- "New Chat" button at top
- Thread items with title preview
- Active thread highlighted

**Chat Panel**:
- Message bubbles (user vs AI)
- Tool call renderers showing note operations
- Input area with send button
- Typing indicator
- Auto-scroll to bottom

**Notes Panel**:
- Real-time updating note list
- Note cards showing title, content preview, tags
- Tag badges with color coding
- Timestamp display
- Note count header

**Tool Renderers** (Custom):
- save_note: Shows "Note saved" with title
- search_notes: Shows search results count
- list_notes: Shows all notes count
- get_notes_by_tag: Shows tagged notes
- update_note: Shows "Note updated"
- delete_note: Shows "Note deleted"

## Functionality Specification

### Core Features

**1. Note CRUD Operations**:
- Create notes with title, content, tags
- Read/search notes by content, tags
- Update note title, content, tags
- Delete notes by ID

**2. AI Agent Integration**:
- Kilo SDK for AI gateway
- Claude Sonnet 3.5 model
- 6 tool definitions for notes
- Guardrails in AGENTS.md

**3. Real-time Sync**:
- Convex subscriptions for live updates
- Notes panel updates automatically
- No manual refresh needed

**4. Thread Management**:
- Multiple conversation threads
- Thread persistence
- Thread switching

### User Interactions

1. **Creating a note**: User asks AI to remember something → AI calls save_note → Note appears in panel
2. **Searching notes**: User asks about specific content → AI calls search_notes → Shows relevant notes
3. **Updating**: User requests changes → AI calls update_note → Note updates in real-time
4. **Deleting**: User requests deletion → AI calls delete_note → Note removed from panel

### Data Handling

**Note Schema**:
```typescript
{
  _id: Id<"notes">
  title: string
  content: string
  tags: string[]
  createdAt: number
  updatedAt: number
}
```

**Thread Schema**:
```typescript
{
  _id: Id<"threads">
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}
```

### Edge Cases
- Empty notes list → Show "No notes yet" message
- Search with no results → Show "No matching notes found"
- Network issues → Show connection status
- Very long notes → Truncate in preview, full in detail

## Acceptance Criteria

1. ✅ Three-panel layout renders correctly
2. ✅ Chat interface allows sending messages
3. ✅ AI responds with note operations
4. ✅ Notes panel shows real-time updates via Convex
5. ✅ All 6 CRUD tools work correctly
6. ✅ Thread sidebar allows switching conversations
7. ✅ Tool results display as visual cards
8. ✅ Environment variables configured correctly
9. ✅ TypeScript compiles without errors
10. ✅ ESLint passes without errors