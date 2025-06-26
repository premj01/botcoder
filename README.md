# BotCoder - VS Code AI Assistant Extension

BotCoder is an AI-powered coding assistant built into a Visual Studio Code extension. It provides intelligent code assistance using Google's Gemini API. The assistant runs in a WebView panel and supports chat interaction, file referencing using @filename mentions, syntax-highlighted code blocks, and environment-based API configuration.

---

## Features

- ✅ React + TypeScript WebView UI
- ✅ Gemini AI integration with `@google/generative-ai`
- ✅ Chat memory across interactions
- ✅ Code blocks with copy buttons
- ✅ Mention files with `@filename` to include content in prompts
- ✅ Automatically scrolls to the latest message
- ✅ YouTube demo link support in README

---

## Project Structure

```
.
├── dist/                   # Bundled frontend and backend
├── src/
│   ├── components/         # React components (ChatMessage, ChatInput, etc.)
│   ├── webview/index.tsx   # React entry for WebView
│   ├── extension.ts        # Main backend entry
├── .env                    # API key configuration
├── esbuild.js              # Build config for backend and frontend
├── webview.html            # WebView HTML wrapper
```

---

## .env Setup

BotCoder reads your API key from a local `.env` file.

### Create `.env`

```env
GEMINI_API_KEY=your_actual_api_key_here
```

> Place this `.env` file **in the root of your extension project** (next to `extension.ts`).

The extension reads and writes to this file automatically if you set your key through the UI.

---

## Install & Build

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

```bash
copy .env.example .env
```

Fill in your API key as shown earlier.

### 3. Build (Watch mode)

```bash
node esbuild.js --watch
```

Or for production:

```bash
node esbuild.js --production
```

---

## Run Extension

1. Open this folder in VS Code
2. Press `F5` to open a new Extension Development Host
3. Run the `BotCoder: Open Chat` command from the Command Palette

---

## Commands (WebView)

- `userPrompt`: send a prompt to Gemini
- `clearChat`: clear message history
- `getFileList`: fetch all workspace file paths
- `updateGeminiAPIKey`: update `.env` file from UI
- `isGeminiAPIKeyHere`: check if API key exists in `.env`

---

## Copy-to-Clipboard Button in Code Blocks

Implemented in `ChatMessage.tsx` using:

```tsx
<button onClick={(e) => handleCopyToClipboard(e, codeText)}>
  {copied ? <FaCheck /> : <FaCopy />}
</button>
```

The icon toggles on successful copy.

---

## Notes

- Uses `dotenv` to manage `.env` vars
- Reinitializes Gemini on each message to load the latest key
- Files are searched recursively, ignoring: `node_modules`, `.git`, `dist`, `build`, etc.

---

## 📺 Demo Video

Watch the walkthrough of BotCoder in action:

[![Watch on YouTube](https://img.youtube.com/vi/YOUR_VIDEO_ID_HERE/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID_HERE)

> Replace `YOUR_VIDEO_ID_HERE` with the actual ID after uploading.

---

## License

MIT

---

## Author

**Prem Jadhav** — built as part of a professional internship project.

> Need help or want to contribute? Open an issue or fork the repo!
