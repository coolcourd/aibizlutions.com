# Shot List — 15 Marketing Screenshots

Each shot includes the exact Playwright commands to capture it. All screenshots saved to `marketing/screenshots/` in the aibizlutions.com repo.

## Prerequisites

Browser must be open with auth injected:
```bash
playwright-cli open http://localhost:3000 --headed
playwright-cli resize 1280 800
playwright-cli eval "localStorage.setItem('auth_token', '<CUSTOMER_ID>')"
playwright-cli goto http://localhost:3000
```

Wait 2–3 seconds after each navigation for React rendering + data fetch.

---

## Shot 01: Command Center Dashboard

The main dashboard with widgets showing key metrics, recent activity, and quick actions.

```bash
playwright-cli goto "http://localhost:3000/#/"
# Wait for dashboard widgets to load
playwright-cli wait-for "[data-testid='dashboard'], .dashboard, main" --timeout 5000
playwright-cli screenshot --filename marketing/screenshots/01-dashboard.png
```

**What to verify**: Metric cards populated, charts rendering, sidebar visible.

---

## Shot 02: CRM Pipeline (Kanban View)

The pipeline kanban board with deals distributed across stages.

```bash
playwright-cli goto "http://localhost:3000/#/crm"
# Wait for pipeline/kanban to render
playwright-cli wait-for ".pipeline, .kanban, [data-testid='pipeline']" --timeout 5000
playwright-cli screenshot --filename marketing/screenshots/02-crm-pipeline.png
```

**What to verify**: Multiple columns (stages), deal cards with values visible, drag-drop indicators.

---

## Shot 03: CRM Contact Detail

A single contact view showing all details, activity history, and linked opportunities.

```bash
# First get a contact's ID — click into first contact from CRM list or navigate directly
playwright-cli goto "http://localhost:3000/#/crm"
# Click on a contact name/card to open detail view
playwright-cli click "text=Sarah Mitchell" --timeout 3000
# If contact opens in a panel or new view, wait
playwright-cli wait-for ".contact-detail, [data-testid='contact-detail']" --timeout 5000
playwright-cli screenshot --filename marketing/screenshots/03-crm-contact-detail.png
```

**What to verify**: Contact info, tags, opportunity list, activity timeline, notes section.

---

## Shot 04: Automation Studio

The workflow builder showing automation agents and their configurations.

```bash
playwright-cli goto "http://localhost:3000/#/automation"
playwright-cli wait-for "main" --timeout 5000
playwright-cli screenshot --filename marketing/screenshots/04-automation-studio.png
```

**What to verify**: Agent cards with status indicators, workflow step visualization, run stats.

---

## Shot 05: Social Media Calendar

The social content calendar showing planned posts across platforms.

```bash
playwright-cli goto "http://localhost:3000/#/social"
playwright-cli wait-for "main" --timeout 5000
# If there's a calendar tab/view, click to it
playwright-cli screenshot --filename marketing/screenshots/05-social-calendar.png
```

**What to verify**: Calendar grid with posts, platform icons, color-coded campaigns, goal banners.

---

## Shot 06: Social Post Composer

The content creation view with AI-assisted writing and platform preview.

```bash
# Look for a "Create Post" or "New Post" button from the social page
playwright-cli goto "http://localhost:3000/#/social"
playwright-cli click "text=Create Post, text=New Post, button:has-text('Create')" --timeout 3000
playwright-cli wait-for "textarea, [contenteditable], .composer" --timeout 5000
playwright-cli screenshot --filename marketing/screenshots/06-social-composer.png
```

**What to verify**: Text editor, platform selector, AI assist button, media upload area, preview.

**Fallback**: If no composer modal/view exists, screenshot the main social page instead and rename to `06-social-overview.png`.

---

## Shot 07: BI Reports & Analytics

The business intelligence dashboard with charts and KPIs.

```bash
playwright-cli goto "http://localhost:3000/#/reports"
playwright-cli wait-for "main" --timeout 5000
playwright-cli screenshot --filename marketing/screenshots/07-bi-reports.png
```

**What to verify**: Charts (bar, line, pie), KPI cards, date range selector, data tables.

---

## Shot 08: Communications Hub

The unified inbox showing threaded conversations across channels.

```bash
playwright-cli goto "http://localhost:3000/#/communications"
playwright-cli wait-for "main" --timeout 5000
# Click into a specific thread for a rich view
playwright-cli click "text=Sarah Mitchell" --timeout 3000
playwright-cli screenshot --filename marketing/screenshots/08-communications.png
```

**What to verify**: Thread list (left), message detail (right), channel indicators, reply box.

---

## Shot 09: Invoicing List

The invoice management view showing all invoices with statuses.

```bash
playwright-cli goto "http://localhost:3000/#/invoicing"
playwright-cli wait-for "main" --timeout 5000
playwright-cli screenshot --filename marketing/screenshots/09-invoicing-list.png
```

**What to verify**: Invoice table/cards, status badges (paid, pending, overdue), amounts, contact names.

---

## Shot 10: Invoice Detail

A single invoice with line items, totals, and payment options.

```bash
# Click into the first invoice from the list
playwright-cli goto "http://localhost:3000/#/invoicing"
playwright-cli click "text=Sarah Mitchell, tr:first-child, .invoice-card:first-child" --timeout 3000
playwright-cli wait-for ".invoice-detail, [data-testid='invoice']" --timeout 5000
playwright-cli screenshot --filename marketing/screenshots/10-invoice-detail.png
```

**What to verify**: Line items table, subtotal/tax/total, payment button, share options.

---

## Shot 11: Integration Hub

The integrations page showing connected and available services.

```bash
playwright-cli goto "http://localhost:3000/#/integrations"
playwright-cli wait-for "main" --timeout 5000
playwright-cli screenshot --filename marketing/screenshots/11-integrations.png
```

**What to verify**: Integration cards (LinkedIn, Instagram, Stripe, QuickBooks), connect/disconnect buttons, status indicators.

---

## Shot 12: Knowledge Base

The knowledge management view with articles and AI-powered search.

```bash
playwright-cli goto "http://localhost:3000/#/knowledge"
playwright-cli wait-for "main" --timeout 5000
playwright-cli screenshot --filename marketing/screenshots/12-knowledge-base.png
```

**What to verify**: Article list/cards, categories, search bar, article content preview.

---

## Shot 13: Settings & Profile

The user profile and app settings page.

```bash
playwright-cli goto "http://localhost:3000/#/settings"
playwright-cli wait-for "main" --timeout 5000
playwright-cli screenshot --filename marketing/screenshots/13-settings.png
```

**What to verify**: Profile info, company details, notification preferences, security settings.

---

## Shot 14: Bot Lab / AI Agents

The AI agent configuration view (if separate from automation).

```bash
# Try telephony/compliance or check if there's a bot lab section
playwright-cli goto "http://localhost:3000/#/telephony"
playwright-cli wait-for "main" --timeout 5000
playwright-cli screenshot --filename marketing/screenshots/14-bot-lab.png
```

**What to verify**: Bot persona cards, configuration options, test chat interface.

**Fallback**: If telephony is empty, try `/#/support` for the support portal instead.

---

## Shot 15: Mobile CRM View

The CRM at mobile viewport showing responsive design.

```bash
playwright-cli resize 375 812
playwright-cli goto "http://localhost:3000/#/crm"
playwright-cli wait-for "main" --timeout 5000
playwright-cli screenshot --filename marketing/screenshots/15-mobile-crm.png
# Reset viewport for subsequent shots
playwright-cli resize 1280 800
```

**What to verify**: Mobile-optimized layout, touch-friendly elements, hamburger menu, stacked cards.

---

## Error Recovery

If any screenshot shows an empty state, error page, or login screen:

1. **Login screen**: Re-inject auth token and reload
   ```bash
   playwright-cli eval "localStorage.setItem('auth_token', '<CUSTOMER_ID>')"
   playwright-cli goto "http://localhost:3000"
   ```

2. **Empty state**: Verify seed data was created for that module. Re-run the relevant seed data API calls.

3. **Error page**: Check browser console for errors
   ```bash
   playwright-cli eval "JSON.stringify(window.__errors || 'no errors captured')"
   ```

4. **Slow load**: Increase wait time
   ```bash
   playwright-cli eval "await new Promise(r => setTimeout(r, 3000))"
   ```

## Naming Convention

All filenames use: `NN-descriptive-name.png` where NN is zero-padded shot number.

If a shot needs to be retaken, use suffix: `02-crm-pipeline-v2.png`.
