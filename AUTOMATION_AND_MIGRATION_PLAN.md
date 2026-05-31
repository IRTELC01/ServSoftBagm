# ServSoftBagm - Automation Strategy & Migration Plan

**Document Version:** 1.0  
**Date:** 2026  
**Author:** Grok (Senior Software Engineer)  
**Status:** For Review

---

## 1. Executive Summary

This document outlines the complete automation strategy for ServSoftBagm during the **validation phase** (zero budget) and the planned migration path once the business generates revenue.

### Current Situation
- No budget available for paid tools or infrastructure.
- Need to validate if the business model works (technical services + invoicing).
- Existing project: React + Node.js + SQLite deployed on Render (free tier).
- Goal: Automate WhatsApp lead management, client intake, and basic follow-up with **$0 cost**.

### Recommended Approach (Validation Phase)
**Make.com + WhatsApp Cloud API** as the primary automation layer.

This combination offers the best balance between:
- Zero cost (within limits)
- Speed of implementation
- No server management
- Acceptable technical debt for a validation phase

### Long-term Vision
Once revenue is generated, migrate to a more robust, scalable, and cost-efficient architecture based on **n8n + Evolution API** (or self-hosted alternatives), with proper backend services, database, and Clean Architecture principles.

---

## 2. Current Project State

### Technology Stack
- **Frontend**: React 19 + Vite + Tailwind CSS (futuristic neon design)
- **Backend**: Node.js + Express 5 + SQLite (better-sqlite3)
- **Authentication**: JWT + optional 2FA
- **Core Features**:
  - Invoice creation and management
  - Basic accounting (income/expense tracking)
  - Client dashboard
  - Web Chatbot (currently being improved)

### Current Deployment
- **Platform**: Render.com (Free Tier)
- **Limitations**:
  - Services sleep after 15 minutes of inactivity
  - Cold starts (slow first request)
  - Limited resources
  - No persistent background workers easily

### Current WhatsApp Situation
- Manual process today
- Web Chatbot exists but only generates a message for the user to copy/paste
- Goal: Automate the entire intake → qualification → notification flow

---

## 3. Why Make.com + WhatsApp Cloud API (Validation Phase)

### 3.1 Technical Justification

**WhatsApp Cloud API (Official Meta)**
- Free tier: 1,000 conversations per month (when the client initiates the conversation)
- Official, stable, and well-documented
- No need to maintain a WhatsApp session or phone number connected 24/7
- Uses webhooks for real-time message reception

**Make.com (formerly Integromat)**
- Free plan: 1,000 operations per month
- Excellent visual builder for complex workflows
- Native WhatsApp Cloud API integration
- Can connect to Google Sheets, Gmail, Airtable, HTTP requests, etc.
- Runs in the cloud (no sleeping issues like Render)

### 3.2 Why Not Other Options Right Now?

| Option                    | Why Not Recommended for $0 Phase                  | Verdict |
|---------------------------|----------------------------------------------------|--------|
| n8n Self-hosted           | Requires maintaining a server that can sleep or crash | Better for later |
| Evolution API             | Needs a server + more setup                        | Good for Phase 2 |
| Custom Node.js backend    | Requires constant server + more development time   | Overkill now |
| WordPress + plugins       | Not suitable for complex business logic            | Not recommended |

### 3.3 Honest Limitations of This Approach

- **Operation limits**: 1,000 operations/month in Make can be consumed quickly with complex scenarios.
- **Vendor lock-in**: Logic lives in Make.com (harder to migrate later).
- **Limited complex logic**: Very advanced business rules become expensive or difficult.
- **Debugging**: More complicated than having code you control.

This is **acceptable technical debt** for the validation phase.

---

## 4. Proposed Architecture for Validation Phase

### High-Level Flow

```
Cliente
   ↓ (WhatsApp o Chatbot Web)
Web Chatbot (ServSoftBagm)
   ↓ (Estructura datos)
Make.com Scenario
   ↓
   ├── Guardar en Airtable / Google Sheets (CRM básico)
   ├── Enviar mensaje estructurado al número de ServSoftBagm
   └── (Opcional) Enviar confirmación automática al cliente
```

### Components

1. **Web Chatbot** (Current)
   - Collects structured data (Name, Phone, Address, Service, Description)
   - Strong validation (already partially implemented)
   - Sends clean data to Make.com via Webhook

2. **Make.com Scenario** (New)
   - Receives data from Web Chatbot
   - Creates record in Airtable/Google Sheets
   - Sends formatted message to company WhatsApp
   - Future: Can trigger email, calendar events, etc.

3. **WhatsApp Cloud API**
   - Official channel for communication
   - Webhook → Make.com

4. **Airtable / Google Sheets**
   - Temporary CRM and client tracking system

---

## 5. Implementation Plan (Validation Phase)

### Phase 1: Foundation (Current)
- [x] Improve Web Chatbot with proper validation
- [ ] Add "Dirección completa" field to Chatbot
- [ ] Create structured data payload
- [ ] Document all fields the chatbot should collect

### Phase 2: Make.com Setup
1. Create WhatsApp Cloud API account (Meta for Developers)
2. Configure WhatsApp Business number
3. Create Make.com account
4. Build first scenario:
   - Webhook trigger
   - Create record in Airtable/Sheets
   - Send message to company WhatsApp
5. Test end-to-end flow

### Phase 3: Dashboard Integration
- Create basic "Clientes" section in Dashboard
- Manual registration of leads that come from WhatsApp
- Basic fields: Name, Phone, Address, Service requested, Status

---

## 6. Detailed Migration Plan (When Revenue Exists)

### 6.1 Target Architecture (Recommended)

**Phase 2 Stack (Recommended when money is available):**

- **WhatsApp**: Evolution API (self-hosted) or official Cloud API
- **Automation Engine**: n8n (self-hosted)
- **Backend**: Node.js with proper Clean Architecture
- **Database**: PostgreSQL (or keep SQLite + migrate later)
- **Hosting**: Railway, Render paid, or VPS (Hetzner, DigitalOcean)
- **Client Management**: Dedicated module in the Dashboard

### 6.2 Migration Phases

**Phase 2.1 - Replace Automation Layer**
- Move from Make.com → n8n self-hosted
- Keep WhatsApp Cloud API initially (easier migration)

**Phase 2.2 - Strengthen Backend**
- Implement proper layered architecture (Domain / Application / Infrastructure)
- Create `Clients` and `ServiceRecords` entities
- Add proper validation, logging, and error handling

**Phase 2.3 - Advanced Features**
- Automated follow-ups
- Service scheduling system
- Equipment tracking per client
- Basic quoting system
- Payment integration (when ready)

**Phase 2.4 - Infrastructure**
- Move to more reliable hosting
- Add monitoring and backups
- Consider message queue (BullMQ or RabbitMQ) for background jobs

### 6.3 Technical Debt We're Accepting Now

- Business logic scattered in Make.com
- No proper client database yet
- Limited reporting
- Manual processes in Dashboard

This debt is **intentional and documented** to move fast during validation.

---

## 7. Security Considerations

### Current Phase (Free Tools)
- Data flows through Make.com and WhatsApp Cloud
- Use strong validation in the Web Chatbot (already in progress)
- Never store sensitive data (passwords, financial info) in Google Sheets
- Be careful with what data you send through webhooks

### Future Phase Recommendations
- Move sensitive client data to controlled database
- Implement proper authentication and authorization
- Add audit logs for service records
- Consider data encryption at rest for client information
- Rate limiting and abuse protection on public endpoints

---

## 8. Deployment Strategy

### Current (Free)
- Frontend + Backend on Render Free Tier
- Make.com handles automation (no deployment needed)
- Airtable/Google Sheets as temporary database

### Recommended Future Deployment
- **Backend**: Railway or Render (paid) or self-hosted VPS
- **Frontend**: Vercel or Netlify (excellent free/paid tiers)
- **Database**: PostgreSQL on Railway/Supabase/Neon
- **Automation**: n8n on Railway or self-hosted
- **WhatsApp**: Evolution API (Docker) or official Cloud API

---

## 9. Recommended Tools & Services (Future)

When budget becomes available, consider:

| Category              | Recommended Tools                     | Reason |
|-----------------------|---------------------------------------|--------|
| WhatsApp Automation   | Evolution API or Wati.io             | More control + features |
| Workflow Automation   | n8n (self-hosted)                    | Unlimited + powerful |
| Database              | PostgreSQL (Supabase / Neon / Railway) | Reliable + scalable |
| Backend Architecture  | Clean Architecture + Repository Pattern | Maintainability |
| Message Queue         | BullMQ (Redis) or RabbitMQ           | Background jobs & reliability |
| Payments              | Stripe or Mercado Pago               | Depending on target market |
| Monitoring            | Sentry + UptimeRobot                 | Error tracking + uptime |

---

## 10. Immediate Next Steps (Action Plan)

1. **This Week**
   - Finish improving the Web Chatbot (add address field + better validation)
   - Create the document "Client Intake Fields" (what data we need to collect)
   - Set up WhatsApp Cloud API (if not done)

2. **Next 1-2 Weeks**
   - Create Make.com account
   - Build first automation scenario
   - Connect Chatbot → Make.com → WhatsApp
   - Test with real leads

3. **Parallel**
   - Start basic "Clientes" section in Dashboard (even if manual entry)
   - Define minimum data model for clients and service records

---

## 11. Risk Analysis

| Risk                              | Probability | Impact | Mitigation |
|-----------------------------------|-------------|--------|----------|
| Make.com free tier runs out       | High        | Medium | Monitor operations, have migration plan ready |
| Make.com changes pricing          | Medium      | High   | Document all scenarios clearly |
| Data loss in Google Sheets        | Medium      | High   | Export backups regularly |
| Client gets bad experience        | Medium      | High   | Keep human in the loop during validation |
| Technical debt becomes too big    | High        | Medium | Plan migration as soon as first revenue appears |

---

## 12. Final Recommendations

1. **Use Make.com + WhatsApp Cloud for the next 3-6 months** while validating.
2. **Document everything** that is being built in Make.com (screenshots + descriptions).
3. **Start building the Client Management module** in the Dashboard as soon as possible (even manually).
4. **Do not over-engineer** the current phase.
5. **Set a clear trigger** for migration (example: when you have 5-10 paying clients or X amount of monthly revenue).

---

## Appendix A: Key Technical Concepts

### WhatsApp Cloud API
Official Meta solution that allows businesses to send and receive WhatsApp messages programmatically without needing a physical phone connected 24/7.

### Make.com Operations
Every action inside a scenario counts as an operation (receiving data, creating a record, sending a message, etc.).

### Evolution API
Self-hosted WhatsApp API that connects to WhatsApp Web. More powerful than Cloud API in some aspects but requires server maintenance.

### n8n
Open-source workflow automation tool. Can be self-hosted and has no operation limits when self-hosted.

---

**Document prepared for review.**

Please read it carefully and let me know if you want to adjust any part of the strategy or the migration plan before we continue implementation.