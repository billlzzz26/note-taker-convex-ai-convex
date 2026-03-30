# Active Context: Note Taker with Convex

## Current State

**Project Status**: ✅ Development in progress

Note Taker AI-powered notebook app built with Next.js, React, Convex, Tailwind CSS, TypeScript. Three-panel layout implemented with thread sidebar, chat, and notes panel. shadcn/ui components installed. Custom modes and subagents configured.

## Recently Completed

- [x] SPEC.md with detailed specifications
- [x] Root `TODO.md` created for Markdown Editor + Sync v1 execution tracking
- [x] `EDITOR-DESIGN.md` created for Markdown editor UI direction using the `ui-ux-pro-max` skill
- [x] `EDITOR-DESIGN.md` updated to use the shared black/teal/aurora token palette for editor UI states
- [x] `src/components/ui/note-editor.tsx` upgraded into a Markdown workspace with write/preview/split modes, toolbar, metadata rail, and note feature badges
- [x] `src/app/globals.css` updated with shared editor color tokens and markdown preview styling
- [x] `src/components/ui/textarea.tsx` updated to forward refs for editor interactions
- [x] `tsconfig.json` updated so production builds exclude Vitest files and setup code
- [x] Local Bun-only dependency recovery unblocked Tailwind/PostCSS build resolution without changing repo package-manager policy
- [x] `src/app/page.tsx` now uses AI Elements `Conversation` and `PromptInput` in the main chat UI
- [x] Kept AI Elements integration on the stable components only, avoiding the current Windows Turbopack `shiki/streamdown` junction panic path
- [x] `.gitignore` now ignores local `.tmp-*` recovery folders and the temporary root artifacts were cleaned up
- [x] `SPEC.md` updated to match the current product state, Markdown roadmap, token system, AI Elements usage, and current platform constraints
- [x] Convex schema and backend functions (convex/notes.ts, convex/schema.ts)
- [x] Three-panel layout: ThreadSidebar, Chat, NotesPanel
- [x] Agent implementation with 6 CRUD tools (save_note, search_notes, list_notes, get_notes_by_tag, update_note, delete_note)
- [x] Real-time notes panel with EventSource subscription
- [x] Environment configuration (.env.example, .env.local)
- [x] Agent tools: lib/tools.ts, lib/convex.ts, lib/env.ts
- [x] Skills files: skills/note-management.md, skills/response-format.md
- [x] API routes: /api/notes/route.ts
- [x] TypeScript typecheck passes
- [x] ESLint passes
- [x] Build passes
- [x] Mobile-first UI/UX rules created
- [x] shadcn/ui setup (Button, Card, Input components)
- [x] Custom modes configured (7 modes: code-reviewer, docs-specialist, frontend-specialist, test-engineer, education, kilo-settings-assistant, session-learner)
- [x] Subagents created: file-name-generator, topic-tagger, history-chat-learner
- [x] Installed feiskyer/claude-code-settings (14 skills)
- [x] Bound skills to custom modes
- [x] Added full Radix UI dependencies (40+ packages)
- [x] Fixed TypeScript errors in ai-elements (voice-selector, schema-display)
- [x] Lint and build pass

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main three-panel layout | ✅ Ready |
| `src/app/components/thread-sidebar.tsx` | Thread navigation | ✅ Ready |
| `src/app/components/notes-panel.tsx` | Real-time notes display | ✅ Ready |
| `src/app/components/note-tool-renderers.tsx` | Tool result display | ✅ Ready |
| `src/components/ui/button.tsx` | shadcn Button | ✅ Ready |
| `src/components/ui/card.tsx` | shadcn Card | ✅ Ready |
| `src/components/ui/input.tsx` | shadcn Input | ✅ Ready |
| `src/lib/utils.ts` | cn() utility | ✅ Ready |
| `src/app/globals.css` | Tailwind + shadcn theme | ✅ Ready |
| `src/app/components/agents/note-taker.ts` | AI agent | ✅ Ready |
| `src/app/components/agents/lib/tools.ts` | 6 CRUD tools | ✅ Ready |
| `src/app/components/agents/lib/convex.ts` | Convex HTTP client | ✅ Ready |
| `src/app/components/agents/lib/env.ts` | Environment variables | ✅ Ready |
| `src/app/api/notes/route.ts` | API route for notes | ✅ Ready |
| `convex/schema.ts` | Database schema | ✅ Ready |
| `convex/notes.ts` | Backend functions | ✅ Ready |
| `convex.json` | Convex configuration | ✅ Ready |
| `SPEC.md` | Project specification | ✅ Ready |
| `.kilocode/rules/mobile-first-ui-ux.md` | Mobile-first rules | ✅ Ready |
| `.kilocode/rules/shadcn-ui.md` | shadcn/ui rules | ✅ Ready |
| `custom_modes.yaml` | Custom agent modes | ✅ Ready |
| `.kilocode/subagents/file-name-generator.yaml` | File renaming subagent | ✅ Ready |
| `.kilocode/subagents/topic-tagger.yaml` | Markdown tagging subagent | ✅ Ready |
| `.kilocode/subagents/history-chat-learner.yaml` | Session learning subagent | ✅ Ready |

## Current Focus

The current app is functional, but the next planned product phase is a Markdown editor upgrade with safer sync semantics. Immediate focus areas are:
1. Build GitHub-first Markdown editor support
2. Keep Convex as the cloud source of truth with cloud-first sync
3. Add autosave, local draft recovery, and conflict-safe version handling
4. Preserve backward compatibility for existing notes during rollout

## Session History

| Date | Changes |
|------|---------|
| Initial | Base Next.js template created |
| Now | Complete Note Taker app with Convex, shadcn/ui, mobile-first rules, custom modes, subagents, ai-elements, and ESLint config |
| 2026-03-30 | Added `TODO.md` checklist for Markdown Editor + Sync v1 implementation planning |
| 2026-03-30 | Added `EDITOR-DESIGN.md` defining the UI system, layout, interactions, and states for the Markdown editor |
| 2026-03-30 | Implemented the first Markdown editor UI pass with the new token palette and preview surface |
| 2026-03-31 | Fixed local Tailwind/PostCSS build resolution under Bun and excluded Vitest files from production TypeScript builds |
| 2026-03-31 | Integrated AI Elements into the main chat UI using `Conversation` and `PromptInput`, while avoiding the unstable `message.tsx` path on Windows |
| 2026-03-31 | Added `.tmp-*` to `.gitignore` and removed temporary dependency-recovery folders from the project root |
| 2026-03-31 | Refreshed `SPEC.md` so it matches the current UI, editor roadmap, sync direction, and known Windows build constraints |

## Pending Items

- [ ] Implement the UI architecture described in `EDITOR-DESIGN.md`
- [ ] Execute the remaining `TODO.md` Phase 1 items for production-ready Markdown behavior
- [ ] Extend Convex schema and note types for markdown sync metadata
- [ ] Implement autosave, local drafts, and conflict-safe sync flow
- [ ] Run `npx convex dev` to set up Convex backend
- [ ] Deploy agent to Kilo platform
- [ ] Configure CONVEX_URL in Kilo dashboard environment variables
