# ADR-0001: GitHub Account Separation (Academic vs Private Business)

**Date**: 2026-05  
**Status**: Accepted  
**Deciders**: Owner (Bernardo Adolfo Gómez Montoya) + Grok (technical advisor)

## Context

ServSoftBagm is a private business application that handles:
- Client data (leads, services, images)
- Invoicing and accounting
- Bank transfer information (account numbers + QR codes)
- WhatsApp automation with customers
- Future payment flows

The owner maintains two GitHub identities:
- `badolfogm` → Used primarily for **academic and scientific** work.
- `IRTELC01` → Currently hosts this repository and is described as the account used for **private business** projects.

The repository is currently hosted at: `git@github.com:IRTELC01/ServSoftBagm.git`

The owner has expressed a clear desire to keep separation between his academic/scientific identity and his private business activities.

## Decision

We will **keep the ServSoftBagm repository under the IRTELC01 account** (the designated "private business" account) instead of moving it to `badolfogm`.

### Rationale

- **Strong separation of concerns**: Academic and scientific work should remain isolated from commercial/client data projects.
- **Data sensitivity**: This repository contains (or will contain) real customer information, bank details, and automation credentials. Keeping it outside the academic profile reduces cross-contamination risk.
- **Future business evolution**: If ServSoftBagm evolves into a formal company or product, it is cleaner if the repository history lives under a dedicated business identity from early on.
- **Owner preference**: The owner explicitly stated that `badolfogm` is used for academic/scientific purposes and IRTELC01 is for private business.

## Consequences

### Positive
- Clear mental and operational separation between academic and commercial work.
- Lower risk of accidentally mixing personal academic reputation with business operations.
- Easier to apply different policies (e.g., private vs public repos, different GitHub organizations later).

### Negative / Trade-offs
- The account name `IRTELC01` currently looks like a personal/test account rather than a professional business presence.
- All future integrations (GitHub Actions, deployments, webhooks, etc.) will be tied to the IRTELC01 identity.
- Slightly higher cognitive load managing two GitHub accounts and their SSH keys.

### Mitigations
- We will improve the professionalism of the IRTELC01 side:
  - Use a proper repository name and description.
  - Consider creating a GitHub Organization under IRTELC01 in the future (e.g. `servsoftbagm`).
  - Maintain high engineering standards in this repo regardless of the account name (Clean Architecture, security, documentation).
- Document this decision clearly so it is not forgotten.

## Alternatives Considered

| Alternative | Pros | Cons | Rejected because |
|-------------|------|------|------------------|
| Move everything to `badolfogm` | Single account, simpler management | Mixes academic identity with private business data and reputation | Violates owner's explicit desire for separation |
| Keep under IRTELC01 without changes | Maintains separation | Current account name feels unprofessional | We will mitigate with better naming/organization later |
| Create a new dedicated business account | Maximum professionalism | Extra account to manage, migration cost | Not worth the overhead at this stage |

## Next Actions

- [x] Record this decision (this document).
- [ ] Before the major payment data architecture refactor, ensure the remote is confirmed as the desired one.
- [ ] Evaluate creating a GitHub Organization under the business account in the medium term.
- [ ] Keep using `badolfogm@gmail.com` strictly for academic/scientific repositories.

## Notes

This decision prioritizes **long-term clarity and risk separation** over short-term convenience, in line with the high engineering standards being applied to the project (Clean Architecture, security shield, comprehensive documentation).

---

**Signed**: 2026-05

---

**Nota (auditoría 2026-07-31)**: este ADR menciona "Clean Architecture" como parte de los estándares de ingeniería aspirados para el proyecto. Esto describe la intención original, no el estado real de implementación: hoy `apps/server` es un monolito Express organizado por capas técnicas (routers con SQL crudo y lógica de negocio mezclada), sin capas domain/application/infrastructure. La migración hacia Clean Architecture / Hexagonal sigue siendo un objetivo futuro (ver Fase 3 del roadmap), no un hecho consumado.