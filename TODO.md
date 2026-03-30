# TODO: Markdown Editor + Sync v1

This checklist turns the approved implementation plan into an execution tracker for the next development phase.

V1 goals:

- GitHub-first Markdown
- Cloud-first sync
- Obsidian-ready architecture

## Phase 1: Editor foundation

- [ ] Choose a markdown editor stack that supports GFM well and can be extended later for Obsidian-style syntax.
- [ ] Extract the current note editing experience from the existing dialog into a dedicated markdown editor component.
- [ ] Add source mode for raw markdown editing.
- [ ] Add preview mode for rendered markdown.
- [ ] Add split view mode for editing and preview side by side.
- [ ] Add a formatting toolbar for headings, bold, italic, code, quote, bullet list, ordered list, task list, table, and links.
- [ ] Support fenced code blocks with syntax highlighting in preview.
- [ ] Ensure paste behavior preserves markdown-friendly content where possible.
- [ ] Keep title and tags editing separate from the markdown document body.
- [ ] Add acceptance check: users can create and edit notes with standard GFM content without falling back to plain textarea-only workflows.

## Phase 2: Persistence and schema changes

- [ ] Add `contentFormat` to the note schema with a v1 default of `"markdown"`.
- [ ] Add `contentVersion` to support optimistic concurrency and sync safety.
- [ ] Add `lastSyncedAt` to track cloud sync status.
- [ ] Add `updatedByClientId` to identify the last writing client.
- [ ] Update note TypeScript types to include the new sync and document metadata.
- [ ] Update `saveNote` to persist markdown metadata for newly created notes.
- [ ] Update `updateNote` to require and validate the current document version.
- [ ] Update note-fetching queries to return the new metadata fields.
- [ ] Define a backward-compatible default for legacy notes that only have raw `content`.
- [ ] Add acceptance check: existing notes still load correctly after schema changes.

## Phase 3: Autosave and local draft support

- [ ] Add debounced autosave for note content updates.
- [ ] Persist unsaved local drafts keyed by note id in browser storage.
- [ ] Restore drafts after refresh, tab crash, or accidental navigation.
- [ ] Show sync state in the UI with at least `Saving`, `Saved`, and `Sync error`.
- [ ] Prevent duplicate autosave writes when content has not changed.
- [ ] Make sure local draft recovery does not silently overwrite newer cloud content.
- [ ] Add acceptance check: a user can type, refresh, and recover an unsaved draft safely.

## Phase 4: Conflict-safe cloud sync

- [ ] Enforce version mismatch detection on note updates.
- [ ] Design a structured conflict response from the backend when the submitted version is stale.
- [ ] Add client handling for structured conflict responses.
- [ ] Add a review UI for local versus server content differences.
- [ ] Let users choose between merge, overwrite, or cancel when a conflict occurs.
- [ ] Preserve both local draft and server version until the conflict is resolved.
- [ ] Add acceptance check: two clients editing the same note do not silently overwrite each other.

## Phase 5: Reader, search, and notes list updates

- [ ] Reuse the markdown rendering pipeline for note preview surfaces where appropriate.
- [ ] Strip or normalize markdown for compact snippets in the notes panel.
- [ ] Improve note search so markdown content remains searchable without rendering full documents.
- [ ] Generate cleaner preview text for headings, lists, and code-heavy notes.
- [ ] Add lightweight visual cues for notes containing code blocks.
- [ ] Add lightweight visual cues for notes containing tables.
- [ ] Add lightweight visual cues for notes containing task lists.
- [ ] Add acceptance check: notes remain easy to browse and search after markdown support is enabled.

## Phase 6: Obsidian-ready extension points

- [ ] Design the parser pipeline so wiki links can be added later without a major refactor.
- [ ] Design renderer extension points for future callout support.
- [ ] Keep schema and UI decisions compatible with future backlinks support.
- [ ] Keep schema and UI decisions compatible with future embed support.
- [ ] Document what is intentionally out of scope for v1 versus reserved for future iterations.
- [ ] Add acceptance check: the v1 architecture does not block future Obsidian-like features.

## Testing checklist

- [x] Add E2E tests for main page layout (three-panel, empty state, chat input, responsive)
- [x] Add E2E tests for thread sidebar (create, select, responsive)
- [x] Add E2E tests for notes panel (visibility, header, responsive)
- [x] Add E2E tests for note tool renderers (rendering, styling, accessibility)
- [ ] Add unit tests for core GFM rendering behavior.
- [ ] Add component tests for source mode, preview mode, and split view.
- [ ] Add tests for toolbar formatting actions.
- [ ] Add tests for autosave behavior and sync status transitions.
- [ ] Add tests for local draft recovery.
- [ ] Add tests for version mismatch and conflict handling.
- [ ] Add regression tests to confirm legacy plain-text notes still work.
- [ ] Add integration coverage for create, edit, refresh, and reload flows.

## Migration and backward compatibility checklist

- [ ] Confirm all existing notes are readable after schema updates.
- [ ] Confirm existing note creation and editing flows do not break during rollout.
- [ ] Confirm legacy notes default cleanly into the markdown format contract.
- [ ] Confirm search still returns useful results for old and new notes.
- [ ] Confirm old note previews degrade gracefully if they contain non-markdown plain text.

## 2026-03-30 (Evening Session)

- [x] Add E2E tests for main page layout (three-panel, empty state, chat input, responsive)
- [x] Add E2E tests for thread sidebar (create, select, responsive)
- [x] Add E2E tests for notes panel (visibility, header, responsive)
- [x] Add E2E tests for note tool renderers (rendering, styling, accessibility)
- [x] Create test runner script and README
- [x] Fix responsive class in note-tool-renderers.tsx (text-lg → sm:text-lg)

## 2026-03-30 (Late Evening Session)

- [x] Created E2E Playwright tests for main page, thread sidebar, notes panel, and note tool renderers using webapp-testing skill
- [x] Created test runner script and README for E2E tests
- [x] Fixed responsive class in note-tool-renderers.tsx (text-lg → sm:text-lg)

## Release readiness checklist

- [ ] Verify backward compatibility end to end in a seeded environment.
- [ ] Test two tabs editing the same note and verify the conflict flow.
- [ ] Test network failure during autosave and confirm drafts are preserved.
- [ ] Review UI states for saving, saved, sync error, and conflict.
- [ ] Review the rollout order for schema, backend, and frontend deployment.
- [ ] Update memory bank files after implementation work is complete.
