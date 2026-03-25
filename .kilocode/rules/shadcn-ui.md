# shadcn/ui Setup Rules

## Installation

### Dependencies (already installed)
```bash
bun add class-variance-authority clsx tailwind-merge lucide-react
```

### Files Created
- `src/lib/utils.ts` - cn() utility function
- `src/components/ui/button.tsx` - Button component
- `src/components/ui/card.tsx` - Card component  
- `src/components/ui/input.tsx` - Input component

## Adding More Components

### Available Components
Run this command to add components:
```bash
npx shadcn@latest add [component]
```

Common components:
- button, card, input, label
- dialog, sheet, modal
- dropdown-menu, select
- tabs, accordion
- toast, sonner
- avatar, badge
- separator, skeleton

### Manual Installation
1. Copy component file to `src/components/ui/`
2. Ensure `@/lib/utils` import works
3. Component ready to use

## Using Components

### Import
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
```

### Variants
```tsx
// Button variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Button sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

## Theming

### CSS Variables (in globals.css)
The theme uses oklch colors for dark mode support:
- `--color-background` - Page background
- `--color-foreground` - Text color
- `--color-primary` - Primary actions
- `--color-secondary` - Secondary elements
- `--color-muted` - Muted backgrounds
- `--color-destructive` - Delete/danger actions
- `--color-border` - Borders

### Customizing Theme
Edit the @theme block in `src/app/globals.css`

## Mobile-First with shadcn

All components are responsive by default. Use Tailwind classes:
```tsx
<Button className="w-full sm:w-auto">Full width mobile</Button>
<Card className="p-4 sm:p-6 md:p-8">Adaptive padding</Card>
```
