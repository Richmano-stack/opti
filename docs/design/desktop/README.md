# Opti desktop design pack

These mockups define the intended desktop experience for the routes and product states that currently exist. They are implementation references, not pixel-perfect specifications. Product behavior and truthful data handling take precedence over decorative details shown in the images.

## Screen inventory

| File | Route or state | Purpose |
| --- | --- | --- |
| `01-landing.png` | `/` | Explain the product and route visitors to guest or account mode. |
| `02-guest-input.png` | `/try` — input | Focused guest composer before generation; no empty preview. |
| `03-guest-review.png` | `/try` — result | Document-first guest review and PDF download. |
| `04-login.png` | `/login` | Returning-user authentication. |
| `05-signup.png` | `/signup` | Account creation and saved-résumé value proposition. |
| `06-master-resume-setup.png` | `/dashboard` — first visit | Guided master résumé setup. |
| `07-master-resume-active.png` | `/dashboard` — saved | View, improve, and reuse the saved master résumé. |
| `08-account-generator-input.png` | `/dashboard/generator` — input | Paste a job description against the saved source résumé. |
| `09-account-generator-blocked.png` | `/dashboard/generator` — no source | Complete master résumé setup before tailoring. |
| `10-account-review.png` | `/dashboard/generator` — result | Review the tailored document and download its PDF. |

## Shared design rules

- Warm white is the primary canvas; very light sky blue is localized support, not a full-page backdrop.
- Deep navy carries text and hierarchy. Saturated blue is reserved for small active or informative accents.
- Primary actions use the approved borderless horizontal gradient: visible light sky blue to pale blue to near-white, with a dark navy label.
- Before generation, use a focused composer and contextual guidance. Do not reserve half the page for an empty result.
- After generation, make the résumé document dominant and keep source information and review checks secondary.
- Prefer document surfaces, dividers, and contextual rails over generic card grids.
- Guest mode clearly states that inputs and generated results are not saved. Account mode clearly states that only the master résumé is saved in the initial product.

## Implementation note

Some generated illustration copy is conceptual. Keep the current product constraint of pasted plain text only, even if an illustration suggests file upload. Do not add unsupported product claims, résumé history, or analytics while implementing these screens.
