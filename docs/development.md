# Development

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- Tauri v2 system dependencies ([see Tauri docs](https://v2.tauri.app/start/prerequisites/))

## Commands

```bash
# Start Tauri dev (frontend + backend)
npm run tauri dev

# Vite dev server only (no Tauri)
npm run dev

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run a specific test file
npx vitest run src/stores/uiStore.test.ts

# Type-check
npx tsc --noEmit

# Build for production
npm run tauri build

# Rust only (from src-tauri/)
cd src-tauri && cargo build
```

## Testing

- **Framework:** Vitest + jsdom
- **Setup:** `src/test/setup.ts` (imports `@testing-library/jest-dom/vitest`)
- **Config:** `globals: true` -- no imports needed for `describe`, `it`, `expect`
- **Location:** Tests are colocated with source files (e.g., `uiStore.test.ts` next to `uiStore.ts`)
- **Count:** 64 test files across stores (7), services (22), utils (12), components (17), constants (3), router (1), hooks (1), and config (1)

### Zustand test pattern

```ts
beforeEach(() => {
  useStore.setState(initialState);
});

it('does something', () => {
  useStore.getState().someAction();
  expect(useStore.getState().value).toBe(expected);
});
```

## Building

```bash
# Build for your current platform
npm run tauri build
```

Produces native installers:
- **Windows** -- `.msi` / `.exe`
- **macOS** -- `.dmg` / `.app`
- **Linux** -- `.deb` / `.AppImage`

## Gmail OAuth Setup

Velo connects directly to Gmail via OAuth. You need your own Google Cloud credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Enable the **Gmail API** and **Google Calendar API**
4. Create OAuth 2.0 credentials (Desktop application)
5. In Velo's Settings, enter your Client ID

> Velo uses PKCE flow -- no client secret is required.

## AI Setup (Optional)

To enable AI features, add your API key for one or more providers in Settings:

- **Anthropic** -- [Get API key](https://console.anthropic.com/)
- **OpenAI** -- [Get API key](https://platform.openai.com/)
- **Google Gemini** -- [Get API key](https://aistudio.google.com/)
