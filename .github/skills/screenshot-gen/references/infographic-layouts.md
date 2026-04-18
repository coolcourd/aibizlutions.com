# Infographic Layouts — Marketing Compositions

HTML/CSS templates for composing screenshots into branded marketing infographics. Each layout is a standalone HTML file that references captured screenshots and gets screenshotted at high resolution via Playwright.

## Rendering Process

For each infographic:
1. Create the HTML file in a temp location (e.g., `marketing/infographics/temp/`)
2. Open in Playwright: `playwright-cli goto "file:///path/to/layout.html"`
3. Resize to target dimensions: `playwright-cli resize <width> <height>`
4. Screenshot: `playwright-cli screenshot --filename marketing/infographics/<name>.png`
5. Delete the temp HTML file

---

## Brand Constants

Use these in all templates:

```css
:root {
  --brand-primary: #0056b3;
  --brand-accent: #ff6b6b;
  --brand-dark: #1f2a41;
  --brand-light: #f4f7f9;
  --brand-white: #ffffff;
  --font-stack: 'Segoe UI', 'Arial', sans-serif;
}
```

---

## Layout 1: Hero Dashboard (1200×630)

Social media OG image — shows the dashboard with branded headline overlay.

**File**: `hero-dashboard.html`

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    overflow: hidden;
    font-family: 'Segoe UI', Arial, sans-serif;
    background: linear-gradient(135deg, #1f2a41 0%, #0056b3 100%);
    position: relative;
  }
  .screenshot-container {
    position: absolute;
    top: 60px;
    right: -40px;
    width: 820px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    transform: perspective(1200px) rotateY(-8deg) rotateX(2deg);
  }
  .screenshot-container img {
    width: 100%;
    display: block;
  }
  .text-overlay {
    position: absolute;
    top: 80px;
    left: 60px;
    width: 420px;
    color: #ffffff;
  }
  .logo-text {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #ff6b6b;
    margin-bottom: 16px;
  }
  h1 {
    font-size: 42px;
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 20px;
  }
  .subtitle {
    font-size: 18px;
    line-height: 1.5;
    opacity: 0.85;
    margin-bottom: 30px;
  }
  .cta-badge {
    display: inline-block;
    background: #ff6b6b;
    color: white;
    padding: 12px 28px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
  }
  .dot-pattern {
    position: absolute;
    bottom: 40px;
    left: 60px;
    width: 100px;
    height: 60px;
    background-image: radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px);
    background-size: 12px 12px;
  }
</style>
</head>
<body>
  <div class="text-overlay">
    <div class="logo-text">AI Bizlutions</div>
    <h1>Your Business,<br>Powered by AI</h1>
    <p class="subtitle">CRM, automation, social media, invoicing, and analytics — all in one platform built for growth.</p>
    <div class="cta-badge">Start Free Beta →</div>
  </div>
  <div class="screenshot-container">
    <!-- Replace with absolute file:// path to screenshot -->
    <img src="SCREENSHOTS_DIR/01-dashboard.png" alt="Dashboard">
  </div>
  <div class="dot-pattern"></div>
</body>
</html>
```

**Viewport**: `playwright-cli resize 1200 630`

---

## Layout 2: Everything Connected (1200×900)

Shows 4 screenshots in a 2×2 grid with connecting lines to demonstrate the integrated platform.

**File**: `everything-connected.html`

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 900px;
    overflow: hidden;
    font-family: 'Segoe UI', Arial, sans-serif;
    background: #f4f7f9;
    padding: 40px;
  }
  .header {
    text-align: center;
    margin-bottom: 40px;
  }
  .header h1 {
    font-size: 36px;
    color: #1f2a41;
    margin-bottom: 8px;
  }
  .header p {
    font-size: 18px;
    color: #666;
  }
  .header .accent { color: #0056b3; font-weight: 700; }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    position: relative;
  }
  .card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    border: 1px solid #e8ecf0;
  }
  .card-label {
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #e8ecf0;
  }
  .card-label .icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    font-weight: 700;
  }
  .card-label .icon.crm { background: #0056b3; }
  .card-label .icon.social { background: #E1306C; }
  .card-label .icon.comms { background: #25D366; }
  .card-label .icon.invoice { background: #FF9800; }
  .card-label span {
    font-size: 15px;
    font-weight: 600;
    color: #1f2a41;
  }
  .card img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    object-position: top left;
    display: block;
  }
  .center-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #0056b3, #ff6b6b);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
    line-height: 1.2;
    box-shadow: 0 4px 20px rgba(0,86,179,0.3);
    z-index: 10;
  }
  .footer {
    text-align: center;
    margin-top: 30px;
    color: #999;
    font-size: 14px;
  }
  .footer strong { color: #0056b3; }
</style>
</head>
<body>
  <div class="header">
    <h1>Everything Your Business Needs, <span class="accent">Connected</span></h1>
    <p>CRM, social media, communications, and invoicing — working together seamlessly.</p>
  </div>
  <div class="grid">
    <div class="card">
      <div class="card-label"><div class="icon crm">C</div><span>CRM & Pipeline</span></div>
      <img src="SCREENSHOTS_DIR/02-crm-pipeline.png" alt="CRM Pipeline">
    </div>
    <div class="card">
      <div class="card-label"><div class="icon social">S</div><span>Social Marketing</span></div>
      <img src="SCREENSHOTS_DIR/05-social-calendar.png" alt="Social Calendar">
    </div>
    <div class="card">
      <div class="card-label"><div class="icon comms">M</div><span>Communications</span></div>
      <img src="SCREENSHOTS_DIR/08-communications.png" alt="Communications Hub">
    </div>
    <div class="card">
      <div class="card-label"><div class="icon invoice">$</div><span>Invoicing</span></div>
      <img src="SCREENSHOTS_DIR/09-invoicing-list.png" alt="Invoicing">
    </div>
    <div class="center-badge">AI<br>Powered</div>
  </div>
  <div class="footer">Powered by <strong>AI Bizlutions</strong> — The all-in-one platform for modern businesses</div>
</body>
</html>
```

**Viewport**: `playwright-cli resize 1200 900`

---

## Layout 3: Lead to Invoice (1200×500)

Horizontal flow showing the customer journey: Lead → Qualify → Close → Invoice.

**File**: `lead-to-invoice.html`

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 500px;
    overflow: hidden;
    font-family: 'Segoe UI', Arial, sans-serif;
    background: linear-gradient(180deg, #1f2a41 0%, #1f2a41 60%, #0056b3 100%);
    padding: 30px 40px;
    color: white;
  }
  .header {
    text-align: center;
    margin-bottom: 30px;
  }
  .header h1 { font-size: 30px; margin-bottom: 6px; }
  .header p { font-size: 16px; opacity: 0.7; }
  .flow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .step {
    text-align: center;
    flex: 1;
    max-width: 240px;
  }
  .step-img {
    width: 220px;
    height: 140px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    margin: 0 auto 12px;
    border: 2px solid rgba(255,255,255,0.15);
  }
  .step-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top left;
  }
  .step-label {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }
  .step-desc {
    font-size: 12px;
    opacity: 0.6;
    line-height: 1.4;
  }
  .arrow {
    font-size: 28px;
    color: #ff6b6b;
    flex-shrink: 0;
    margin-top: -40px;
  }
  .step-number {
    display: inline-block;
    width: 28px;
    height: 28px;
    line-height: 28px;
    border-radius: 50%;
    background: #ff6b6b;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .footer {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    opacity: 0.5;
  }
</style>
</head>
<body>
  <div class="header">
    <h1>From Lead to Invoice — Fully Automated</h1>
    <p>Every step of the customer journey, managed in one platform</p>
  </div>
  <div class="flow">
    <div class="step">
      <div class="step-number">1</div>
      <div class="step-img"><img src="SCREENSHOTS_DIR/02-crm-pipeline.png" alt="Lead capture"></div>
      <div class="step-label">Capture Lead</div>
      <div class="step-desc">AI scores & routes new leads automatically</div>
    </div>
    <div class="arrow">→</div>
    <div class="step">
      <div class="step-number">2</div>
      <div class="step-img"><img src="SCREENSHOTS_DIR/03-crm-contact-detail.png" alt="Qualify"></div>
      <div class="step-label">Qualify & Nurture</div>
      <div class="step-desc">Track engagement across all channels</div>
    </div>
    <div class="arrow">→</div>
    <div class="step">
      <div class="step-number">3</div>
      <div class="step-img"><img src="SCREENSHOTS_DIR/08-communications.png" alt="Close"></div>
      <div class="step-label">Close the Deal</div>
      <div class="step-desc">Unified comms for seamless negotiations</div>
    </div>
    <div class="arrow">→</div>
    <div class="step">
      <div class="step-number">4</div>
      <div class="step-img"><img src="SCREENSHOTS_DIR/10-invoice-detail.png" alt="Invoice"></div>
      <div class="step-label">Send Invoice</div>
      <div class="step-desc">One-click billing with online payment</div>
    </div>
  </div>
  <div class="footer">AI Bizlutions — Streamline your entire business workflow</div>
</body>
</html>
```

**Viewport**: `playwright-cli resize 1200 500`

---

## Layout 4: Data-Driven Decisions (1200×630)

Analytics-focused layout showing BI reports with metric callouts.

**File**: `data-driven.html`

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    overflow: hidden;
    font-family: 'Segoe UI', Arial, sans-serif;
    background: #ffffff;
  }
  .top-bar {
    background: #1f2a41;
    padding: 20px 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
  }
  .top-bar h1 { font-size: 24px; }
  .top-bar .brand { color: #ff6b6b; font-size: 14px; font-weight: 600; letter-spacing: 1px; }
  .content {
    display: flex;
    height: calc(100% - 68px);
  }
  .screenshot-panel {
    flex: 1;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .screenshot-panel img {
    width: 100%;
    max-width: 700px;
    border-radius: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  }
  .metrics-panel {
    width: 320px;
    background: #f4f7f9;
    padding: 30px 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
  }
  .metric {
    background: white;
    border-radius: 10px;
    padding: 16px 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border-left: 4px solid #0056b3;
  }
  .metric.accent { border-left-color: #ff6b6b; }
  .metric.green { border-left-color: #4CAF50; }
  .metric.orange { border-left-color: #FF9800; }
  .metric-value {
    font-size: 28px;
    font-weight: 700;
    color: #1f2a41;
    margin-bottom: 2px;
  }
  .metric-label {
    font-size: 13px;
    color: #888;
  }
  .metrics-footer {
    font-size: 11px;
    color: #bbb;
    text-align: center;
    margin-top: 8px;
  }
</style>
</head>
<body>
  <div class="top-bar">
    <h1>Data-Driven Decisions, Powered by AI</h1>
    <div class="brand">AI BIZLUTIONS</div>
  </div>
  <div class="content">
    <div class="screenshot-panel">
      <img src="SCREENSHOTS_DIR/07-bi-reports.png" alt="BI Reports Dashboard">
    </div>
    <div class="metrics-panel">
      <div class="metric">
        <div class="metric-value">$1.2M</div>
        <div class="metric-label">Pipeline Value</div>
      </div>
      <div class="metric accent">
        <div class="metric-value">87%</div>
        <div class="metric-label">Close Rate (AI-assisted)</div>
      </div>
      <div class="metric green">
        <div class="metric-value">3.2x</div>
        <div class="metric-label">ROI vs. Manual Process</div>
      </div>
      <div class="metric orange">
        <div class="metric-value">-62%</div>
        <div class="metric-label">Admin Time Saved</div>
      </div>
      <div class="metrics-footer">* Demo data — Pinnacle Property Group</div>
    </div>
  </div>
</body>
</html>
```

**Viewport**: `playwright-cli resize 1200 630`

---

## Template Variable Replacement

Before rendering, replace `SCREENSHOTS_DIR` in all HTML files with the absolute file path:

```bash
# Example for Windows:
SCREENSHOTS_DIR="file:///c:/Users/rchas/Code/aibizlutions.com/marketing/screenshots"
```

Use `sed` or string replacement in the HTML before opening in Playwright:
```bash
sed -i "s|SCREENSHOTS_DIR|file:///c:/Users/rchas/Code/aibizlutions.com/marketing/screenshots|g" layout.html
```

---

## GIF Storyboard

15 seconds at 4 fps = ~60 frames. Distribute across 7 screens:

| Frames | Screen | Duration | Transition |
|--------|--------|----------|------------|
| 1–9 | Dashboard | 2.25s | Hold on hero view |
| 10–18 | CRM Pipeline | 2.25s | Scroll pipeline left-right |
| 19–26 | Social Calendar | 2.0s | Show calendar view |
| 27–34 | Communications | 2.0s | Click into thread |
| 35–42 | Invoicing | 2.0s | Show invoice list |
| 43–50 | Automation | 2.0s | Show agent configs |
| 51–60 | BI Reports | 2.5s | End on analytics |

Capture at 800×500 viewport for smaller GIF file size.

```bash
mkdir -p marketing/gif-frames
playwright-cli resize 800 500

# Dashboard frames
playwright-cli goto "http://localhost:3000/#/"
# Capture frames 0001-0009 with slight scroll
for i in $(seq 1 9); do
  playwright-cli screenshot --filename "marketing/gif-frames/frame_$(printf '%04d' $i).png"
done

# CRM frames
playwright-cli goto "http://localhost:3000/#/crm"
for i in $(seq 10 18); do
  playwright-cli screenshot --filename "marketing/gif-frames/frame_$(printf '%04d' $i).png"
done

# ... repeat for each screen section ...

# Assemble
ffmpeg -framerate 4 \
  -i "marketing/gif-frames/frame_%04d.png" \
  -vf "scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" \
  -loop 0 \
  marketing/bo-botty-demo.gif
```

Target file size: under 5 MB. If larger, reduce to 3 fps or fewer frames per screen.
