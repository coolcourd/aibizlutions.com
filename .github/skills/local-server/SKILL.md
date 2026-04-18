---
name: local-server
description: "Start and manage a local HTTP server for static site testing. Use when: serving the site locally, testing in browser, running UX audits, previewing changes before deploy."
---

# Local Server

Start a local HTTP server to serve the AI Bizlutions static site for testing and preview.

## Start Server

From the project root:
```bash
npx serve . -l 3000
```

This serves all files from the current directory on `http://localhost:3000`.

**Alternative** (if `serve` is not available):
```bash
python -m http.server 3000
```

## Verify

After starting, confirm the server is running:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

Expected: `200`

## Base URL

- **Local**: `http://localhost:3000`
- **Homepage**: `http://localhost:3000/index.html`
- **Privacy Policy**: `http://localhost:3000/privacy-policy/`

## Stop Server

Press `Ctrl+C` in the terminal running the server.

## Notes

- The server must be running before any Playwright browser testing
- Start the server in async mode so it runs in the background while tests execute
- Port 3000 is the default; if occupied, use another port and update Playwright commands accordingly
