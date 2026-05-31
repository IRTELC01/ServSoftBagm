# ADR-0002: Professional Structure for Bank Transfer Data

**Date**: 2026  
**Status**: Accepted

## Context
The original approach for showing bank transfer details in the admin Dashboard used a loose `.txt` file inside `client/public/Ayudas/`, combined with ad-hoc folders like `REAL/` and complex `.gitignore` rules. This was inconsistent with the project's push toward Clean Architecture and professional standards.

## Decision
We migrated the bank transfer information to a proper configuration module:

- **Text data** (bank, account number, holder, CC, instructions): `client/src/config/bank.ts`
- **QR Code image**: `client/public/assets/bank/QRBanco.jpeg`

This follows the same philosophy applied to other parts of the system (e.g. telemetry services, IA engine):
- Configuration is centralized and typed.
- Sensitive business data is not scattered in public asset folders as raw text files.
- The legacy `Ayudas/` folder is now marked as deprecated for this purpose.

## Rationale
- Better maintainability and version control of business configuration.
- Eliminates the need for fragile file-based loading + complex ignore rules for real data.
- Aligns with the high engineering standards required for this private business project.
- The QR remains a static asset (necessary), but lives in a clearly named professional location (`assets/bank/`).

## Consequences
- The old `Ayudas/REAL/` pattern and direct `.txt` loading are no longer used.
- Developers must place the real QR in `public/assets/bank/QRBanco.jpeg`.
- Account details are now edited in `src/config/bank.ts`.

## Verification Checklist (for owner)
- [ ] Real QR placed in `client/public/assets/bank/QRBanco.jpeg`
- [ ] Dashboard shows correct bank information from the config
- [ ] QR image loads correctly in the admin panel
- [ ] No console errors related to bank data
- [ ] Legacy files in `Ayudas/` can be safely ignored or deleted

This decision supports the overall goal of a professional, maintainable codebase.