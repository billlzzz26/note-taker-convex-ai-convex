# Mobile-First UI/UX Rules

## Golden Rule: Mobile First Always

**Every UI change must be mobile-first.** Start with the smallest screen, then scale up. Never design for desktop first and adapt down.

- Base CSS = mobile layout
- Add `sm:` `md:` `lg:` progressively for larger screens
- Test mobile layout before desktop layout
- If a component works on mobile, it will work on desktop. The reverse is not true.

---

## Core Principles

### 1. Design for Mobile First
- Start with mobile layouts, then scale up (not desktop down)
- Mobile constraints drive better, cleaner designs
- Content is king on small screens - no clutter

### 2. Responsive Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### 3. Touch-Friendly Design
- Minimum touch target: 44x44px (iOS guideline)
- Spacing between targets: 8px minimum
- No hover-only interactions
- Swipe gestures for common actions

### 4. Layout Patterns

**Mobile (default):**
- Single column layout
- Stack components vertically
- Bottom navigation or hamburger menu
- Full-width content with 16px padding

**Tablet (sm/md):**
- Two-column where appropriate
- Side navigation becomes visible
- Larger touch targets

**Desktop (lg+):**
- Full multi-column layouts
- Persistent sidebars
- Mouse hover states enabled

### 5. Performance
- Lazy load images and components
- Minimize JavaScript on mobile
- Use native browser features
- Optimize fonts (subset, woff2)

### 6. Accessibility
- Minimum contrast ratio: 4.5:1
- Focus indicators visible
- Screen reader friendly
- Reduce motion option

## Implementation Guidelines

### CSS/Tailwind
```tsx
// Mobile-first: start with base styles, add sm: md: lg: for larger screens
<div className="w-full px-4 sm:px-6 md:px-8">
  <h1 className="text-xl sm:text-2xl md:text-3xl">Title</h1>
</div>
```

### Components
- Use collapsible sections on mobile
- Modal dialogs for complex forms
- Bottom sheets for actions
- Floating action buttons for primary actions

### Navigation
- Mobile: Bottom tab bar or hamburger
- Tablet: Side rail
- Desktop: Full sidebar
