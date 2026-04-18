# Seed Data — Pinnacle Property Group

Realistic fake data for a fictional real-estate business. All data seeded via REST API.

## Auth Header

All requests (except auth) need:
```
Authorization: Bearer <CUSTOMER_ID>
```

Replace `<CUSTOMER_ID>` with the value returned from login.

---

## 1. Test Account

### Sign Up
```bash
curl -X POST http://localhost:4000/dev/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chase Headman",
    "email": "demo@pinnacleproperty.com",
    "password": "Demo2026!Secure",
    "company": "Pinnacle Property Group",
    "plan": "professional"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@pinnacleproperty.com",
    "password": "Demo2026!Secure"
  }'
```
Response → `{ customerId: "<TOKEN>" }` — save this for all subsequent calls.

---

## 2. CRM Pipeline

Create one pipeline with 5 stages representing a real estate sales funnel.

```json
{
  "name": "Property Sales Pipeline",
  "description": "End-to-end real estate sales funnel from inquiry to closing",
  "steps": [
    { "stepId": "inquiry", "order": 1, "type": "action", "action": { "type": "crm_update", "params": { "label": "New Inquiry" } }, "onSuccess": "showing" },
    { "stepId": "showing", "order": 2, "type": "action", "action": { "type": "crm_update", "params": { "label": "Showing Scheduled" } }, "onSuccess": "offer" },
    { "stepId": "offer", "order": 3, "type": "action", "action": { "type": "crm_update", "params": { "label": "Offer Made" } }, "onSuccess": "negotiation" },
    { "stepId": "negotiation", "order": 4, "type": "action", "action": { "type": "crm_update", "params": { "label": "In Negotiation" } }, "onSuccess": "closed" },
    { "stepId": "closed", "order": 5, "type": "action", "action": { "type": "crm_update", "params": { "label": "Closed / Won" } } }
  ]
}
```

---

## 3. Contacts (14 contacts)

Create each via `POST /api/contacts`. Vary statuses for pipeline distribution.

```json
[
  {
    "name": "Sarah Mitchell",
    "email": "sarah.mitchell@luxerealty.com",
    "phone": "+1-404-555-0142",
    "company": "Luxe Realty Partners",
    "status": "Customer",
    "jobTitle": "Managing Broker",
    "notes": "Referred by Atlanta Chamber. Manages 40+ agents. Interested in CRM + social suite.",
    "tags": ["vip", "referral", "enterprise"]
  },
  {
    "name": "James Thornton",
    "email": "j.thornton@thorntondev.com",
    "phone": "+1-212-555-0198",
    "company": "Thornton Development Group",
    "status": "Qualified",
    "jobTitle": "CEO",
    "notes": "Met at NAR Conference 2025. Developing 3 mixed-use projects in Midtown.",
    "tags": ["conference-lead", "high-value"]
  },
  {
    "name": "Maria Gonzalez",
    "email": "maria@suncoasthomes.com",
    "phone": "+1-813-555-0167",
    "company": "Suncoast Homes",
    "status": "Customer",
    "jobTitle": "Sales Director",
    "notes": "Active user since Q1. Using automation for drip campaigns.",
    "tags": ["active", "automation-user"]
  },
  {
    "name": "David Park",
    "email": "dpark@parkproperties.net",
    "phone": "+1-310-555-0234",
    "company": "Park Properties LA",
    "status": "Lead",
    "jobTitle": "Principal Broker",
    "notes": "Inbound from Google Ads. Requested demo of invoicing module.",
    "tags": ["inbound", "demo-requested"]
  },
  {
    "name": "Amanda Foster",
    "email": "amanda.foster@hearthstone.co",
    "phone": "+1-615-555-0189",
    "company": "Hearthstone Real Estate",
    "status": "Qualified",
    "jobTitle": "Operations Manager",
    "notes": "Currently using Salesforce. Pain point: too expensive for 12-agent team.",
    "tags": ["competitor-switch", "mid-market"]
  },
  {
    "name": "Robert Chen",
    "email": "rchen@horizoncommercial.com",
    "phone": "+1-415-555-0276",
    "company": "Horizon Commercial Realty",
    "status": "Customer",
    "jobTitle": "VP of Leasing",
    "notes": "Commercial focus. Heavy user of BI reports and pipeline analytics.",
    "tags": ["commercial", "analytics-user", "enterprise"]
  },
  {
    "name": "Priya Sharma",
    "email": "priya@elevaterealty.com",
    "phone": "+1-678-555-0321",
    "company": "Elevate Realty Group",
    "status": "Lead",
    "jobTitle": "Founder",
    "notes": "Startup brokerage, 5 agents. Wants all-in-one platform to avoid tool sprawl.",
    "tags": ["startup", "all-in-one"]
  },
  {
    "name": "Marcus Williams",
    "email": "marcus@premierpm.com",
    "phone": "+1-704-555-0158",
    "company": "Premier Property Management",
    "status": "Customer",
    "jobTitle": "Director of Operations",
    "notes": "Property management company. 200+ rental units. Uses invoicing + comms heavily.",
    "tags": ["property-mgmt", "high-volume"]
  },
  {
    "name": "Lauren DuBois",
    "email": "lauren@bayoulivingre.com",
    "phone": "+1-504-555-0443",
    "company": "Bayou Living Real Estate",
    "status": "Qualified",
    "jobTitle": "Team Lead",
    "notes": "Expanding from 8 to 20 agents. Needs scalable CRM.",
    "tags": ["growth", "scaling"]
  },
  {
    "name": "Kevin O'Brien",
    "email": "kobrien@keystonegroup.com",
    "phone": "+1-267-555-0312",
    "company": "Keystone Group",
    "status": "Lead",
    "jobTitle": "Managing Partner",
    "notes": "Philly-based luxury market. Interested in social media automation.",
    "tags": ["luxury", "social-interested"]
  },
  {
    "name": "Nina Vasquez",
    "email": "nina@vanguardre.com",
    "phone": "+1-305-555-0287",
    "company": "Vanguard Real Estate",
    "status": "Customer",
    "jobTitle": "Marketing Director",
    "notes": "Power user of social module. Runs campaigns for 6 offices.",
    "tags": ["marketing", "social-power-user", "multi-office"]
  },
  {
    "name": "Tom Harrison",
    "email": "tom@redstonerealty.com",
    "phone": "+1-602-555-0199",
    "company": "Redstone Realty",
    "status": "Churned",
    "jobTitle": "Owner",
    "notes": "Churned after trial. Price objection — revisit with annual pricing.",
    "tags": ["churned", "price-sensitive", "re-engage"]
  },
  {
    "name": "Elena Petrova",
    "email": "elena@summitresidential.com",
    "phone": "+1-312-555-0456",
    "company": "Summit Residential",
    "status": "Qualified",
    "jobTitle": "Acquisitions Manager",
    "notes": "Institutional investor contact. Evaluating for 50-unit portfolio management.",
    "tags": ["institutional", "high-value", "evaluation"]
  },
  {
    "name": "Jackson Moore",
    "email": "jackson@mooreandco.com",
    "phone": "+1-512-555-0378",
    "company": "Moore & Co. Properties",
    "status": "Lead",
    "jobTitle": "Associate Broker",
    "notes": "Austin market. Saw us on LinkedIn. Wants to see CRM + knowledge base.",
    "tags": ["linkedin-lead", "austin"]
  }
]
```

---

## 4. Opportunities (10 deals)

Create via `POST /api/contacts/{contactId}/opportunities`. Replace `<contactId>` and `<pipelineId>` with actual IDs from previous steps.

Map contacts to stages for a realistic pipeline view:

| Contact | Opportunity Title | Value (cents) | Stage | Probability |
|---------|------------------|---------------|-------|-------------|
| Sarah Mitchell | Enterprise CRM Suite — Luxe Realty | 2400000 | closed | 100 |
| James Thornton | Thornton Dev — Full Platform | 1800000 | negotiation | 75 |
| Maria Gonzalez | Suncoast Homes — Annual Renewal | 960000 | closed | 100 |
| David Park | Park Properties — CRM + Invoicing | 1440000 | inquiry | 20 |
| Amanda Foster | Hearthstone — Platform Migration | 1560000 | offer | 60 |
| Robert Chen | Horizon — BI Analytics Add-on | 600000 | closed | 100 |
| Lauren DuBois | Bayou Living — Scale-up Package | 1200000 | showing | 40 |
| Kevin O'Brien | Keystone — Social Automation | 840000 | inquiry | 15 |
| Elena Petrova | Summit — Portfolio Management | 3600000 | showing | 35 |
| Jackson Moore | Moore & Co — Starter CRM | 480000 | inquiry | 10 |

```json
{
  "title": "Enterprise CRM Suite — Luxe Realty",
  "value": 2400000,
  "stage": "closed",
  "probability": 100,
  "expectedCloseDate": "2026-03-15",
  "pipelineId": "<PIPELINE_ID>",
  "notes": "12-month contract signed. Onboarding complete."
}
```

Repeat for each row, adjusting `contactId`, `title`, `value`, `stage`, `probability`, and dates.

Use close dates spread across 2026:
- Closed deals: past dates (Jan–Mar 2026)
- Active deals: future dates (May–Aug 2026)

---

## 5. Products (5 products for invoicing)

Create via `POST /api/products`.

```json
[
  {
    "name": "Professional Plan — Monthly",
    "description": "Full-featured CRM, automation, and social media tools",
    "unitPriceCents": 9900,
    "taxable": true,
    "category": "subscription",
    "sku": "PRO-MONTHLY",
    "recurring": true,
    "recurringInterval": "monthly"
  },
  {
    "name": "Enterprise Plan — Monthly",
    "description": "Unlimited users, priority support, custom integrations",
    "unitPriceCents": 24900,
    "taxable": true,
    "category": "subscription",
    "sku": "ENT-MONTHLY",
    "recurring": true,
    "recurringInterval": "monthly"
  },
  {
    "name": "Onboarding & Setup",
    "description": "White-glove onboarding, data migration, team training",
    "unitPriceCents": 150000,
    "taxable": false,
    "category": "service",
    "sku": "ONBOARD-001"
  },
  {
    "name": "Custom Integration Development",
    "description": "Custom API integration with third-party systems",
    "unitPriceCents": 500000,
    "taxable": false,
    "category": "service",
    "sku": "CUSTOM-INT"
  },
  {
    "name": "AI Credits Pack — 1000",
    "description": "1000 AI generation credits for content, analysis, and automation",
    "unitPriceCents": 4900,
    "taxable": true,
    "category": "credits",
    "sku": "AI-1000"
  }
]
```

---

## 6. Customer Invoices (4 invoices)

Create via `POST /api/customer-invoices`. Reference `contactId` and `contactName` from created contacts.

```json
[
  {
    "contactId": "<sarah_mitchell_id>",
    "contactName": "Sarah Mitchell",
    "dueAt": "2026-04-01T00:00:00.000Z",
    "notes": "Enterprise annual subscription — Luxe Realty Partners",
    "lineItems": [
      { "description": "Enterprise Plan — Monthly", "quantity": 12, "unitPriceCents": 24900 },
      { "description": "Onboarding & Setup", "quantity": 1, "unitPriceCents": 150000 }
    ]
  },
  {
    "contactId": "<maria_gonzalez_id>",
    "contactName": "Maria Gonzalez",
    "dueAt": "2026-04-15T00:00:00.000Z",
    "notes": "Q2 renewal — Suncoast Homes",
    "lineItems": [
      { "description": "Professional Plan — Monthly", "quantity": 3, "unitPriceCents": 9900 },
      { "description": "AI Credits Pack — 1000", "quantity": 2, "unitPriceCents": 4900 }
    ]
  },
  {
    "contactId": "<robert_chen_id>",
    "contactName": "Robert Chen",
    "dueAt": "2026-03-31T00:00:00.000Z",
    "notes": "BI Analytics integration — Horizon Commercial",
    "lineItems": [
      { "description": "Custom Integration Development", "quantity": 1, "unitPriceCents": 500000 },
      { "description": "Professional Plan — Monthly", "quantity": 6, "unitPriceCents": 9900 }
    ]
  },
  {
    "contactId": "<marcus_williams_id>",
    "contactName": "Marcus Williams",
    "dueAt": "2026-05-01T00:00:00.000Z",
    "notes": "Premier PM — monthly subscription + credits",
    "lineItems": [
      { "description": "Professional Plan — Monthly", "quantity": 1, "unitPriceCents": 9900 },
      { "description": "AI Credits Pack — 1000", "quantity": 5, "unitPriceCents": 4900 }
    ]
  }
]
```

---

## 7. Communication Threads (5 threads + messages)

### Threads — `POST /api/threads`

```json
[
  { "contactName": "Sarah Mitchell", "contactHandle": "sarah.mitchell@luxerealty.com", "channel": "email", "subject": "Onboarding Kickoff" },
  { "contactName": "James Thornton", "contactHandle": "j.thornton@thorntondev.com", "channel": "email", "subject": "Platform Demo Follow-up" },
  { "contactName": "Nina Vasquez", "contactHandle": "@ninavasquez", "channel": "instagram", "subject": "Campaign Collaboration" },
  { "contactName": "Amanda Foster", "contactHandle": "amanda.foster@hearthstone.co", "channel": "email", "subject": "Migration Timeline" },
  { "contactName": "Marcus Williams", "contactHandle": "+1-704-555-0158", "channel": "sms", "subject": "Invoice Question" }
]
```

### Messages — `POST /api/messages`

For each thread, create 3–4 messages. Replace `<threadId>` with actual IDs.

**Thread 1 — Sarah Mitchell (email)**
```json
[
  { "threadId": "<t1>", "content": "Hi Chase, we're excited to get started with AI Bizlutions! When can we schedule the onboarding call?", "direction": "inbound" },
  { "threadId": "<t1>", "content": "Hi Sarah! I've blocked off Tuesday at 2pm EST for your team's onboarding session. I'll send a calendar invite with the Zoom link. We'll cover CRM setup, user roles, and your pipeline configuration.", "direction": "outbound" },
  { "threadId": "<t1>", "content": "Perfect, Tuesday works. Can we also go over the social media scheduling tool? Our marketing team is eager to start.", "direction": "inbound" },
  { "threadId": "<t1>", "content": "Absolutely! I'll add 30 minutes for the social module walkthrough. See you Tuesday!", "direction": "outbound" }
]
```

**Thread 2 — James Thornton (email)**
```json
[
  { "threadId": "<t2>", "content": "Chase, thanks for the demo yesterday. The pipeline visualization is exactly what we need for our development projects. What's the timeline for the QuickBooks integration?", "direction": "inbound" },
  { "threadId": "<t2>", "content": "Great question, James. The QuickBooks integration is live now — you can connect it from Settings > Integrations. It syncs invoices, payments, and contact data bi-directionally.", "direction": "outbound" },
  { "threadId": "<t2>", "content": "Excellent. I'll loop in our CFO for the financial side. Can you send over the enterprise pricing for 25 users?", "direction": "inbound" }
]
```

**Thread 3 — Nina Vasquez (Instagram DM)**
```json
[
  { "threadId": "<t3>", "content": "Hey! Loving the new reel generator. We used it for our Open House campaign and got 3x engagement 🔥", "direction": "inbound" },
  { "threadId": "<t3>", "content": "That's amazing, Nina! Would you be open to us featuring Vanguard as a case study? We'd love to showcase those results.", "direction": "outbound" },
  { "threadId": "<t3>", "content": "Absolutely! Let's set up a quick interview. DM me the details.", "direction": "inbound" }
]
```

**Thread 4 — Amanda Foster (email)**
```json
[
  { "threadId": "<t4>", "content": "Hi Chase, we've decided to move forward with the migration from Salesforce. What's the data export process look like?", "direction": "inbound" },
  { "threadId": "<t4>", "content": "Great news, Amanda! We have a streamlined migration tool. Export your Salesforce contacts as CSV, and our import wizard maps fields automatically. Typical migration takes 2-3 hours for your data volume.", "direction": "outbound" },
  { "threadId": "<t4>", "content": "That's much faster than I expected. Can we start next Monday?", "direction": "inbound" },
  { "threadId": "<t4>", "content": "Monday works! I'll send you the pre-migration checklist this afternoon.", "direction": "outbound" }
]
```

**Thread 5 — Marcus Williams (SMS)**
```json
[
  { "threadId": "<t5>", "content": "Hey Chase, quick q - can tenants pay invoices directly from the link?", "direction": "inbound" },
  { "threadId": "<t5>", "content": "Yes! Every invoice has a shareable payment link. Tenants can pay via credit card or ACH. You can also send reminders via SMS.", "direction": "outbound" },
  { "threadId": "<t5>", "content": "Game changer. Sending the first batch tonight 👍", "direction": "inbound" }
]
```

---

## 8. Social Goals (3 goals)

Create via `POST /api/social/goals`.

```json
[
  {
    "name": "Spring Open House Campaign",
    "phase": "launch",
    "objective": "Drive 500+ RSVPs for Q2 open house events across 6 offices",
    "startDate": "2026-04-01",
    "endDate": "2026-05-15",
    "platforms": ["Instagram", "Facebook", "LinkedIn"],
    "status": "active",
    "color": "#4CAF50"
  },
  {
    "name": "Brand Awareness — Pinnacle Launch",
    "phase": "awareness",
    "objective": "Establish Pinnacle Property Group brand presence with 10K followers milestone",
    "startDate": "2026-03-01",
    "endDate": "2026-06-30",
    "platforms": ["Instagram", "TikTok", "LinkedIn"],
    "status": "active",
    "color": "#2196F3"
  },
  {
    "name": "Client Testimonial Series",
    "phase": "engagement",
    "objective": "Publish 12 client success story reels to boost trust and social proof",
    "startDate": "2026-04-15",
    "endDate": "2026-07-15",
    "platforms": ["Instagram", "TikTok", "Facebook"],
    "status": "active",
    "color": "#FF9800"
  }
]
```

---

## 9. Autonomous Agents (2 workflows)

Create via `POST /api/agents`.

```json
[
  {
    "name": "Lead Follow-up Bot",
    "description": "Automatically sends personalized follow-up emails to new leads within 5 minutes of form submission",
    "prompt": "You are a friendly real estate assistant. Draft a warm follow-up email acknowledging the lead's interest. Mention their specific property preferences if available. Keep it under 150 words.",
    "workflow": [
      { "id": "step-1", "action": "crm_update", "params": { "status": "Contacted" }, "description": "Update contact status to Contacted" },
      { "id": "step-2", "action": "ai_process", "params": { "model": "gemini", "task": "generate_email" }, "description": "AI drafts personalized email" },
      { "id": "step-3", "action": "send_email", "params": { "template": "follow-up" }, "description": "Send the generated email" }
    ],
    "schedule": "rate(5 minutes)",
    "timezone": "America/New_York",
    "integrations": ["email", "crm"]
  },
  {
    "name": "Weekly Market Report",
    "description": "Generates and distributes a weekly market analysis report to all active clients every Monday at 8am",
    "prompt": "Generate a concise real estate market report for the Atlanta metro area. Include median prices, inventory levels, days on market, and notable trends. Format for email delivery.",
    "workflow": [
      { "id": "step-1", "action": "ai_process", "params": { "model": "gemini", "task": "market_analysis" }, "description": "AI analyzes market data" },
      { "id": "step-2", "action": "send_email", "params": { "template": "market-report", "audience": "active-clients" }, "description": "Email report to active clients" },
      { "id": "step-3", "action": "social_post", "params": { "platforms": ["linkedin"], "template": "market-update" }, "description": "Post summary to LinkedIn" }
    ],
    "schedule": "cron(0 8 ? * MON *)",
    "timezone": "America/New_York",
    "integrations": ["email", "social", "ai"]
  }
]
```

---

## 10. Knowledge Base Articles (3 articles)

Create via `POST /api/knowledge`.

```json
[
  {
    "title": "Atlanta Metro Q1 2026 Market Report",
    "content": "The Atlanta metro real estate market showed continued strength in Q1 2026. Median home prices rose 4.2% year-over-year to $385,000. Inventory levels remain tight at 2.1 months of supply, favoring sellers. Average days on market decreased to 28 days from 34 in Q4 2025. The luxury segment ($1M+) saw particular demand in Buckhead and Sandy Springs, with multiple-offer situations becoming the norm. Commercial leasing activity in Midtown corridors increased 12% driven by tech sector expansion.",
    "category": "Market Reports",
    "tags": ["atlanta", "q1-2026", "market-data"],
    "source": "internal-analysis"
  },
  {
    "title": "Client Onboarding Playbook",
    "content": "Step 1: Send welcome email with login credentials and getting-started guide. Step 2: Schedule 30-minute onboarding call within 48 hours. Step 3: Configure CRM pipeline stages to match their sales process. Step 4: Import existing contacts via CSV wizard. Step 5: Set up automation rules for lead follow-up. Step 6: Connect social media accounts. Step 7: Create first invoice template. Step 8: 2-week check-in call to review adoption and answer questions.",
    "category": "Playbooks",
    "tags": ["onboarding", "process", "best-practice"],
    "source": "team-knowledge"
  },
  {
    "title": "Objection Handling: Price Comparison with Salesforce",
    "content": "Common objection: 'Salesforce does all of this.' Response framework: 1) Acknowledge Salesforce is powerful. 2) Highlight that SF requires expensive add-ons for social, invoicing, and AI features that are included in our platform. 3) Show total cost comparison: SF Professional ($80/user) + Pardot ($1,250/mo) + CPQ ($75/user) vs. our all-in-one at $99/user. 4) Emphasize real estate-specific workflows vs. generic CRM. 5) Offer free migration service as a sweetener.",
    "category": "Sales",
    "tags": ["objection-handling", "salesforce", "competitive"],
    "source": "sales-team"
  }
]
```
