# TODO - Note Taker Project

## Pending Work

- [x] Convex dev setup (CONVEX_DEPLOY_KEY)
- [x] .env.example created
- [x] @vitest/ui installed for test UI
- [x] Run tests: `bun test:run` (10/10 passed)
- [x] TypeScript typecheck: `bun typecheck` (passed)
- [x] ESLint: `bun lint` (warnings only, no errors)
- [x] Rule 6 (Always Work Rule) added to project-rules.md
- [ ] Run test UI: `bun test:ui`
- [ ] Deploy agent to Kilo platform: `bun run deploy`
- [ ] Configure CONVEX_URL in Kilo dashboard environment variables
- [ ] Production build: `bun build`

## Convex Deploy Key Format

```
CONVEX_DEPLOY_KEY=dev:valiant-oriole-905|eyJ2...0=
```

## Commands Reference

| Command | Purpose |
|---------|---------|
| `bun dev` | Start Next.js dev server |
| `bun test:run` | Run tests once |
| `bun test:ui` | Open Vitest UI |
| `bun typecheck` | TypeScript check |
| `bun lint` | ESLint check |
| `bun build` | Production build |
| `CONVEX_DEPLOY_KEY=... npx convex dev --once` | Push Convex functions |
