---
name: screenshot-gen
description: "Marketing screenshot generation workflow for the AI Bizlutions app. Use when: capturing product screenshots, seeding fake data, composing infographics, generating demo GIFs. Contains seed data payloads, shot lists, and infographic templates."
---

# Screenshot Generation — Marketing Asset Workflow

Automate the capture of marketing screenshots, infographics, and demo GIFs from the AI Bizlutions app.

## When to Use

- Creating product evidence screenshots for the marketing site
- Populating the app with realistic fake data for demos
- Composing branded infographic images from screenshots
- Generating animated GIF walkthroughs of the app

## Prerequisites

1. **App repo** at `c:\Users\rchas\Code\AI-Bizlutions-` with `node_modules` installed
2. **Backend `.env`** configured with API keys (DynamoDB, Gemini, etc.)
3. **Frontend `.env`** with `VITE_API_URL=http://localhost:4000/dev`
4. **Playwright** Chromium browser installed
5. **ffmpeg** installed for GIF generation

## Quick Reference

| Reference | Purpose |
|-----------|---------|
| [Seed Data](./references/seed-data.md) | JSON payloads for all fake business data |
| [Shot List](./references/shot-list.md) | Every screenshot with exact Playwright commands |
| [Infographic Layouts](./references/infographic-layouts.md) | HTML/CSS templates for marketing compositions |

## API Configuration

- **Backend base URL**: `http://localhost:4000/dev`
- **Auth header**: `Authorization: Bearer <customerId>`
- **All endpoints prefixed with**: `/api/`

## Procedure

### Step 1: Start the App

```bash
# Terminal 1 — Backend (async)
cd "c:\Users\rchas\Code\AI-Bizlutions-\backend" && npm run offline

# Terminal 2 — Frontend (async)
cd "c:\Users\rchas\Code\AI-Bizlutions-" && npm run dev
```

Verify both are running:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/dev/api/plans   # expect 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000                  # expect 200
```

### Step 2: Create Test Account

```bash
# Sign up
curl -X POST http://localhost:4000/dev/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Chase Headman","email":"demo@pinnacleproperty.com","password":"Demo2026!Secure","company":"Pinnacle Property Group"}'

# Login (capture customerId from response)
curl -X POST http://localhost:4000/dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@pinnacleproperty.com","password":"Demo2026!Secure"}'
```

The login response returns `{ success: true, data: { customerId: "xxx", ... } }`. Save the `customerId` — it IS the auth token.

### Step 3: Seed Data

Load [seed-data.md](./references/seed-data.md) and execute all API calls with the auth token. Order matters:
1. Pipeline + stages (contacts reference pipeline stages)
2. Contacts (opportunities reference contacts)
3. Opportunities (linked to contacts)
4. Social posts
5. Invoices
6. Communication threads

### Step 4: Capture Screenshots

Load [shot-list.md](./references/shot-list.md) and follow each scene. General pattern:

```bash
playwright-cli open http://localhost:3000 --headed
playwright-cli resize 1280 800
playwright-cli eval "localStorage.setItem('auth_token', '<CUSTOMER_ID>')"
playwright-cli goto http://localhost:3000
# Wait for app to load, then navigate + screenshot
```

Save all screenshots to `marketing/screenshots/` in the aibizlutions.com repo.

### Step 5: Compose Infographics

Load [infographic-layouts.md](./references/infographic-layouts.md). For each layout:
1. Create a temporary HTML file with the template
2. Reference captured screenshots via `file://` paths
3. Open in Playwright at 1200×630 (social media OG size)
4. Screenshot the composed page
5. Save to `marketing/infographics/`

### Step 6: Generate GIF

Capture rapid sequential frames while navigating:

```bash
# Set consistent viewport
playwright-cli resize 800 500

# For each screen: navigate, wait 500ms, capture 8-9 frames
# Name frames sequentially: frame_0001.png, frame_0002.png, etc.

# Assemble with ffmpeg
ffmpeg -framerate 4 -i marketing/gif-frames/frame_%04d.png \
  -vf "scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 marketing/bo-botty-demo.gif
```

### Step 7: Verify & Report

Check all outputs:
```bash
ls -la marketing/screenshots/
ls -la marketing/infographics/
ls -la marketing/bo-botty-demo.gif
```

Report: total files, sizes, any missing/failed screens.

## Output Structure

```
marketing/
├── screenshots/
│   ├── 01-dashboard.png
│   ├── 02-crm-pipeline.png
│   ├── 03-crm-contact-detail.png
│   ├── 04-automation-studio.png
│   ├── 05-social-calendar.png
│   ├── 06-social-composer.png
│   ├── 07-bi-reports.png
│   ├── 08-communications.png
│   ├── 09-invoicing-list.png
│   ├── 10-invoice-detail.png
│   ├── 11-integrations.png
│   ├── 12-knowledge-base.png
│   ├── 13-settings.png
│   ├── 14-bot-lab.png
│   └── 15-mobile-crm.png
├── infographics/
│   ├── hero-dashboard.png
│   ├── everything-connected.png
│   ├── lead-to-invoice.png
│   └── data-driven.png
├── gif-frames/
│   └── frame_NNNN.png (temporary, can be deleted after GIF)
└── bo-botty-demo.gif
```
