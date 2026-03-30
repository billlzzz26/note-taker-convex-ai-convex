# Markdown Editor UI Design

This document defines the UI and UX design for the next-generation note editor.

Scope:
- GitHub-first Markdown editing
- Cloud-first sync
- Obsidian-ready architecture
- Next.js + shadcn/ui + Tailwind implementation target

## 1. Design Intent

The editor should feel like a focused writing workspace for technical and knowledge-heavy notes, not a generic modal form.

Primary design goals:
- Make writing the main action
- Keep sync confidence visible without being noisy
- Support both plain writing and structured Markdown authoring
- Let metadata stay accessible without competing with the document
- Leave architectural room for future wiki links, callouts, backlinks, and embeds

Recommended style direction from `ui-ux-pro-max`:
- Style: Minimal Swiss with high-clarity technical polish
- Typography: Inter-based system
- Mood: clean, precise, dark, professional, high-end productivity
- Avoid: decorative shadows, visual clutter, oversized ornamental effects

## 2. Visual System

### Typography

- Font family: `Inter`, with the existing app font system as fallback
- Title input:
  - 24px desktop
  - 20px mobile
  - weight 600
  - tracking `-0.02em`
- Body editor:
  - 15px desktop
  - 16px mobile
  - line-height `1.65`
  - weight 400
- Toolbar labels and sync labels:
  - 12px
  - weight 500
- Metadata labels:
  - 11px uppercase
  - weight 500
  - tracking `0.08em`

### Color Tokens

Use the following token set as the source of truth for the editor UI:

```css
:root {
  /* Dark Neutrals */
  --black-primary: #050505;
  --black-secondary: #0a0a0a;
  --black-tertiary: #111111;

  /* Light Neutrals */
  --platinum: #fafafa;
  --warm-grey: #888888;
  --warm-grey-light: #aaaaaa;

  /* Accent Teal */
  --accent-teal: #5eead4;
  --accent-teal-dim: #2dd4bf;
  --accent-teal-dark: #0d9488;

  /* Aurora Colors */
  --aurora-red: #ff4757;
  --aurora-yellow: #EBCB8B;
  --aurora-lime: #32ff00;
  --aurora-purple: #6B3FA0;

  /* Glass Effect */
  --glass: rgba(255,255,255,0.03);
  --glass-border: rgba(255,255,255,0.08);

  /* Syntax Highlighting */
  --syntax-string: #5eead4;
  --syntax-keyword: #d4d4d4;
  --syntax-comment: #5a5a5a;
  --syntax-heading: #ffffff;
}
```

Map semantic UI roles onto those tokens instead of inventing a second palette:

- `editor-bg`: `var(--black-primary)`
- `editor-surface`: `var(--black-secondary)`
- `editor-surface-2`: `var(--black-tertiary)`
- `editor-glass`: `var(--glass)`
- `editor-border`: `var(--glass-border)`
- `editor-text-primary`: `var(--platinum)`
- `editor-text-secondary`: `var(--warm-grey)`
- `editor-text-muted`: `var(--warm-grey-light)`
- `editor-accent`: `var(--accent-teal)`
- `editor-accent-hover`: `var(--accent-teal-dim)`
- `editor-accent-strong`: `var(--accent-teal-dark)`
- `editor-warning`: `var(--aurora-yellow)`
- `editor-danger`: `var(--aurora-red)`
- `editor-success`: `var(--aurora-lime)`
- `editor-future-feature`: `var(--aurora-purple)`

Color intent by surface:

- Main app background: `var(--black-primary)`
- Editor shell background: `var(--black-secondary)`
- Toolbar, metadata rail, preview cards: `var(--black-tertiary)` with optional `var(--glass)` overlays
- Borders and dividers: `var(--glass-border)`
- Primary document text: `var(--platinum)`
- Secondary metadata text: `var(--warm-grey)`
- Inactive helper text: `var(--warm-grey-light)`

State usage:

- Active toolbar item: `var(--accent-teal)` text/icon with tinted background
- Focus ring: `var(--accent-teal-dim)`
- Saved state: `var(--aurora-lime)`
- Saving state: `var(--accent-teal)`
- Unsaved draft or stale state: `var(--aurora-yellow)`
- Sync error or destructive action: `var(--aurora-red)`
- Future Obsidian-reserved affordances: `var(--aurora-purple)` used sparingly

Guidelines:

- Teal is the primary interaction accent and should dominate over blue.
- Aurora colors are state signals, not general decoration.
- Purple should be rare and reserved for advanced/future knowledge graph behaviors, not common actions.
- Avoid bright full-surface fills; keep the UI grounded in black neutrals and glass separators.
- Use glow very sparingly, and only for focused or active technical states.

### Shape and Elevation

- Radius:
  - editor shell: 16px
  - toolbar groups: 12px
  - buttons and pills: 10px
  - inputs and tabs: 10px
- Shadows:
- use one soft elevation level only for floating overlays
- keep main editor mostly flat with separation via borders and contrast
- prefer glass panels over heavy shadows for layered sections

## 3. Layout Structure

Replace the current narrow modal with a large document workspace.

### Desktop Layout

Use a wide dialog or sheet with a three-zone composition:

1. Top bar
- left: document icon, note status, current mode
- center: optional breadcrumb or note location label
- right: sync state, autosave status, save shortcut hint, close action

2. Main body
- primary column: markdown editor
- optional secondary column: live preview
- collapsible right rail: note metadata and document insights

3. Bottom utility strip
- character count
- word count
- cursor position
- markdown hint
- conflict or draft recovery notices when applicable

Suggested desktop proportions:
- source-only mode: single main column, max readable width 760px inside editor
- split mode: 56% source / 44% preview
- with metadata rail: right rail width 280px

### Tablet Layout

- keep top bar and toolbar fixed
- source and preview switch via segmented control instead of persistent side-by-side
- metadata moves into a slide-over panel

### Mobile Layout

- full-screen sheet only
- title on top, toolbar below
- segmented toggle: `Write`, `Preview`, `Meta`
- sticky bottom action strip for sync state and close action
- no dual-pane split view on mobile

## 4. Core Components

### A. Editor Shell

Purpose:
- frame the note as a document workspace instead of a form

Contains:
- title input
- markdown toolbar
- mode switcher
- editor body
- sync status

Behavior:
- shell remains stable when switching modes
- only the content pane changes

### B. Title Row

Structure:
- large title input
- compact status chip to the right

Status chip states:
- `Saved`
- `Saving`
- `Draft`
- `Sync error`
- `Conflict`

Rules:
- title always visible
- title should not be hidden behind tabs or metadata

### C. Markdown Toolbar

Toolbar groups:

1. Document structure
- H1
- H2
- H3
- Quote
- Code block

2. Inline formatting
- Bold
- Italic
- Inline code
- Link

3. Lists
- Bullet list
- Ordered list
- Task list

4. Insertions
- Table
- Divider
- Image placeholder

5. View controls
- Write
- Preview
- Split

Design rules:
- icon-first buttons with tooltip labels
- active formatting state highlighted
- minimum touch target 40x40 desktop, 44x44 mobile
- keyboard shortcuts shown in tooltip for major actions

### D. Writing Surface

Behavior:
- calm, dense, readable writing area
- preserve whitespace
- monospace only for code spans and code blocks, not for entire document

Visual rules:
- no visible textarea chrome in immersive mode
- use a soft inset background for the editor canvas
- line highlight for active line is optional but should be subtle
- placeholder should teach, not merely prompt

Suggested placeholder:
- `Write in Markdown. Use / or the toolbar to format quickly.`

### E. Preview Surface

Purpose:
- show GitHub-first rendering quality and reassure formatting accuracy

Rendering rules:
- headings clearly spaced
- blockquotes use left accent bar
- tables scroll horizontally within preview if needed
- fenced code blocks use darker inset panel with syntax highlighting
- task lists preserve checkbox semantics

Syntax color rules:
- strings: `var(--syntax-string)`
- keywords/operators: `var(--syntax-keyword)`
- comments: `var(--syntax-comment)`
- markdown headings in preview: `var(--syntax-heading)`
- code block background: `var(--black-primary)` or slightly lifted from it with `var(--glass)`

Preview should use the same rendering pipeline later reused by note cards and detail view.

### F. Metadata Rail

Sections:
- Tags
- Last edited
- Last synced
- Version
- Future reserved: backlinks, links, note stats

Behavior:
- collapsible by default in narrower viewports
- should never crowd the writing surface

### G. Draft Recovery Banner

Show at top of the editor body when a local draft exists and differs from cloud content.

Actions:
- `Restore draft`
- `Compare`
- `Dismiss`

Tone:
- informative, not alarming

Recommended color treatment:
- background: transparent panel over `var(--black-tertiary)`
- border/accent: `var(--aurora-yellow)`
- action emphasis: `var(--accent-teal)`

### H. Conflict Resolution Panel

Used only when version mismatch occurs.

Layout:
- left column: local content
- right column: server content
- top explanation bar
- action row:
  - `Merge later`
  - `Overwrite cloud`
  - `Discard local`

Visual treatment:
- stronger border and warning/danger accent
- still consistent with editor shell
- use `var(--aurora-red)` only for critical conflict framing, and `var(--aurora-yellow)` for cautionary copy where possible

## 5. Interaction Design

### Editing Flow

1. User opens a note
2. Title and content load immediately
3. Editor shows `Saved`
4. As user types, state changes to `Saving...`
5. After debounce + successful update, state changes to `Saved`
6. If network fails, state becomes `Sync error`
7. If server version differs, state becomes `Conflict`

### Save Feedback

Use subtle, layered feedback:
- status chip in title row
- optional tiny pulse on successful save
- no toast for every autosave
- toast only for error, recovery, or destructive actions

Recommended chip color mapping:
- `Saved`: `var(--aurora-lime)`
- `Saving...`: `var(--accent-teal)`
- `Unsaved draft`: `var(--aurora-yellow)`
- `Sync error`: `var(--aurora-red)`
- `Conflict`: mix of `var(--aurora-red)` border with `var(--aurora-yellow)` supporting text

### Keyboard Model

Key shortcuts to support in UI design:
- `Ctrl/Cmd + B` bold
- `Ctrl/Cmd + I` italic
- `Ctrl/Cmd + Shift + 7` ordered list
- `Ctrl/Cmd + Shift + 8` bullet list
- `Ctrl/Cmd + K` link
- `Ctrl/Cmd + S` force save
- `Esc` close overlays, not destroy draft

### Focus Behavior

- first focus on title for new note
- first focus on editor body for existing note if title is already populated
- visible focus ring on all toolbar buttons and metadata controls

## 6. Accessibility Requirements

Derived from `ui-ux-pro-max` high-priority rules:

- all icon-only buttons must have `aria-label`
- visible labels for title, content mode, and tags
- contrast target: 4.5:1 minimum for body text
- full keyboard navigation for toolbar, tabs, dialogs, and metadata rail
- do not rely on color alone for sync states
- support reduced motion by disabling decorative transitions
- all interactive targets at least 44x44 on mobile surfaces
- form feedback must be close to the relevant area

## 7. Motion Guidelines

Motion should communicate state, never decorate.

- toolbar hover and press: 150ms
- panel transitions: 180-220ms
- split-preview resize feedback: immediate, no elastic gimmicks
- status changes:
  - subtle fade between `Saving` and `Saved`
  - stronger pulse only for `Sync error` or `Conflict`

Avoid:
- large scaling animations
- bouncing panels
- animated width changes that reflow the editor repeatedly

## 8. Notes List and Preview Alignment

To keep the product coherent, the editor design should influence reader surfaces too.

### Notes Card Updates

- title remains the first visual anchor
- snippet should strip markdown syntax noise
- small indicators for:
  - code block
  - table
  - task list
- updated time should move to a quieter metadata row

Recommended note-card palette:
- card background: `var(--black-tertiary)`
- hover surface: mix of `var(--glass)` over `var(--black-tertiary)`
- title: `var(--platinum)`
- snippet: `var(--warm-grey-light)`
- metadata row: `var(--warm-grey)`
- active or selected outline: `var(--accent-teal-dim)`

### Search UX

- search field should match editor shell language
- results should show cleaner excerpts from markdown
- highlight matched text in a lightweight way

## 9. Implementation Mapping

This is the intended UI evolution from the current codebase.

Current target to evolve:
- `src/components/ui/note-editor.tsx`

Recommended component split:
- `src/components/ui/markdown-note-editor.tsx`
- `src/components/ui/markdown-toolbar.tsx`
- `src/components/ui/markdown-preview.tsx`
- `src/components/ui/note-sync-status.tsx`
- `src/components/ui/note-conflict-panel.tsx`

Existing `note-editor.tsx` can become an orchestration wrapper or be replaced after migration.

## 10. Suggested User Experience Copy

Status labels:
- `Saved`
- `Saving...`
- `Unsaved draft`
- `Sync error`
- `Conflict detected`

Helpful microcopy:
- `Write in Markdown with GitHub-style formatting.`
- `Your changes are saved automatically.`
- `A newer cloud version exists. Review before replacing it.`
- `Recovered a local draft from this device.`

## 11. Out of Scope for This Design Pass

These are intentionally not primary UI commitments for v1:
- wiki-link interaction model
- backlinks explorer
- embedded note blocks
- graph view
- collaborative cursors
- CRDT/live multi-user presence

The layout leaves room for these later through the metadata rail and future side panels.

## 12. Acceptance Criteria

- The editor reads as a writing workspace, not a CRUD form.
- Metadata remains available without competing with the document body.
- Toolbar actions are discoverable, keyboard accessible, and touch-safe.
- Sync state is always understandable.
- Preview rendering feels trustworthy for GitHub-style Markdown.
- The design scales cleanly from desktop to mobile.
- The UI leaves room for Obsidian-like features without forcing them into v1.
