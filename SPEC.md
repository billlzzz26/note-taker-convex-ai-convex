# Note Taker with Convex - Specification

## Project Overview

- **Project Name**: Note Taker
- **Type**: AI-powered notebook application with persistent notes, real-time updates, and a Markdown-first editor roadmap
- **Core Functionality**: Users can chat with an AI assistant to create, search, update, and delete notes, while browsing and editing notes in a richer document-oriented UI
- **Primary Direction**: GitHub-first Markdown, cloud-first sync, Obsidian-ready architecture
- **Target Users**: Users who want an AI-assisted note workspace for technical, personal, and structured knowledge capture

## Product State

### Implemented Now

- Three-panel application layout
- AI chat flow for note CRUD operations
- Convex-backed note storage
- Real-time notes panel updates
- Markdown-oriented note editor UI with:
  - write mode
  - preview mode
  - split mode
  - formatting toolbar
  - metadata rail
  - document feature badges in the notes list
- Main chat UI upgraded to use stable AI Elements primitives:
  - `Conversation`
  - `PromptInput`
- Shared black/teal/aurora design token system in the app theme

### Planned Next

- Schema-level markdown metadata
- autosave and local draft recovery
- conflict-safe cloud sync
- production-grade Markdown rendering pipeline
- future Obsidian-style extensions such as wiki links and callouts

## UI/UX Specification

### Layout Structure

**Three-Panel Layout**:
- **Left Panel**: thread navigation and conversation switching
- **Center Panel**: AI chat and assistant interaction surface
- **Right Panel**: notes browser with live note previews

### Responsive Intent

- Desktop: full three-panel workspace
- Tablet: reduced side density with collapsible/supporting panels
- Mobile: prioritize single primary panel and stacked workflows

### Visual Design System

The UI now follows a shared dark technical palette.

**Core Tokens**:
- `--black-primary: #050505`
- `--black-secondary: #0a0a0a`
- `--black-tertiary: #111111`
- `--platinum: #fafafa`
- `--warm-grey: #888888`
- `--warm-grey-light: #aaaaaa`
- `--accent-teal: #5eead4`
- `--accent-teal-dim: #2dd4bf`
- `--accent-teal-dark: #0d9488`
- `--aurora-red: #ff4757`
- `--aurora-yellow: #EBCB8B`
- `--aurora-lime: #32ff00`
- `--aurora-purple: #6B3FA0`

**Design Language**:
- dark, editorial, technical workspace
- minimal glass layering instead of heavy shadows
- teal used as the primary interaction accent
- aurora colors reserved for status and semantic feedback

### Typography

- Primary UI font: current app sans stack
- Editor and workspace styling should remain readable and dense
- Large title styling for note titles
- compact uppercase metadata labels for utility surfaces

## Center Panel Specification

### Chat Experience

The center panel is the AI collaboration surface.

Current behavior:
- conversation list on the left
- chat history in the center
- prompt composer at the bottom
- tool results rendered inline below assistant responses

Current implementation direction:
- use AI Elements where stable and useful
- avoid unstable AI Elements paths that currently trigger Windows Turbopack issues

### AI Elements Usage Policy

Currently approved usage in the app:
- `Conversation`
- `PromptInput`

Currently avoided in production build:
- `message.tsx` / `MessageResponse` path from AI Elements, because the current Windows + Turbopack environment hits a `shiki/streamdown` junction panic

This means:
- AI Elements are part of the active UI stack
- but only the stable subset is used in the main UI right now

## Notes Panel Specification

The right panel is a live notes browser.

Expected behavior:
- show notes returned from Convex in real time
- show title first
- show compact content snippet
- show tags
- show feature badges for markdown-heavy content when present

Current feature badges:
- code
- table
- task list

Snippet rules:
- strip markdown noise where possible
- keep preview readable instead of literal raw markdown syntax

## Note Editor Specification

### Design Goal

The note editor should feel like a document workspace, not a plain CRUD modal.

### Current Editor UI

Implemented in the current UI layer:
- title field
- markdown formatting toolbar
- write / preview / split modes
- metadata rail
- sync/document status visuals
- markdown-oriented preview surface

### Current Rendering State

The current preview renderer is a lightweight in-app renderer intended to move the UI forward quickly.

It supports:
- headings
- blockquotes
- bullet and ordered lists
- task lists
- tables
- fenced code blocks
- inline emphasis and links

It is not yet the final production-grade GFM renderer.

### Target V1 Editor Direction

- GitHub-first Markdown authoring
- separate title/tags editing from document body
- preview surfaces that feel trustworthy
- sync feedback that is always visible
- room for future Obsidian-like features without implementing them yet

## Data Model Specification

### Current Note Schema

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

### Planned Note Schema Extensions

```typescript
{
  contentFormat: "markdown"
  contentVersion: number
  lastSyncedAt?: number
  updatedByClientId?: string
}
```

These fields are planned but not yet fully implemented in the backend.

## Functionality Specification

### Core Features

**1. AI Note Operations**
- create notes
- search notes
- list notes
- filter notes by tag
- update notes
- delete notes

**2. Real-Time Note Visibility**
- notes panel updates from Convex-backed state
- no manual refresh required for the main browsing flow

**3. Markdown Workspace Direction**
- users can edit note content in a richer editor
- note previews are more document-like than before
- editor architecture is moving toward markdown-first behavior

**4. Cloud-First Sync Roadmap**
- Convex remains the source of truth
- local draft behavior will be additive, not a replacement for cloud sync

## Acceptance Criteria

### Current Acceptance

1. The three-panel workspace renders correctly.
2. Chat requests can create and update notes through the AI assistant.
3. Notes appear in the notes panel and stay browseable.
4. The main app theme uses the shared black/teal/aurora token system.
5. The note editor exposes write, preview, and split workflows.
6. The main chat UI uses stable AI Elements primitives without breaking build reliability.
7. `bun run build` passes.
8. `bun run typecheck` passes.

### V1 Markdown + Sync Acceptance

1. Users can author notes in GitHub-style Markdown without falling back to plain textarea-only workflows.
2. Existing notes remain backward compatible during rollout.
3. Sync state is visible and understandable.
4. Local drafts can be recovered safely.
5. Concurrent edits do not silently overwrite each other.
6. The architecture remains open for future Obsidian-style extensions.

## Known Constraints

- The current environment has shown Bun dependency-linking issues on Windows during local recovery work.
- The current environment has shown a Windows Turbopack panic when importing the AI Elements `message.tsx` path that pulls `shiki/streamdown`.
- Because of that, AI Elements are being adopted incrementally rather than all at once.

## Source of Truth Documents

The spec should be read together with:
- [`TODO.md`](D:\dev\26\note-taker-convex-ai-convex\TODO.md)
- [`EDITOR-DESIGN.md`](D:\dev\26\note-taker-convex-ai-convex\EDITOR-DESIGN.md)

These documents define:
- execution checklist
- editor UX contract
- markdown and sync roadmap
