# uma_theme

Custom Frappe app providing **Uma Furnitures** branding + an AI-powered contextual help system on top of ERPNext v16.

Part of the [TLDM ERPNext stack](https://github.com/numberonewastefellow/uma_erp/blob/main/TLDM_SETUP.md).

---

## What it ships

| Component | File | Purpose |
|-----------|------|---------|
| Theme CSS | `uma_theme/public/css/uma_theme.css` | Uma Furnitures colour scheme, typography, logo overrides |
| Theme JS | `uma_theme/public/js/uma_theme.js` | Desk tweaks, branding hooks |
| Help system JS | `uma_theme/public/js/uma_help.js` | `(?)` button on form pages → contextual help popover |
| Help content | `uma_theme/public/help/en.json` | Doctype-indexed help copy (AI-generated, hand-edited) |
| App hooks | `uma_theme/hooks.py` | Registers CSS/JS includes with Frappe |

---

## Install

Standalone on any Frappe bench:
```bash
bench get-app https://github.com/numberonewastefellow/uma_theme
bench --site <sitename> install-app uma_theme
```

In the TLDM Docker stack it is baked into the `tldm-erpnext:v16` image via `tldm_apps.json` — no manual install needed.

---

## Develop

Edit files locally. For a quick in-container test without a full image rebuild:
```bash
docker cp uma_theme/uma_theme/public/css/uma_theme.css \
  frappe_docker-frontend-1:/home/frappe/frappe-bench/apps/uma_theme/uma_theme/public/css/uma_theme.css
docker exec frappe_docker-backend-1 bench --site mysite.localhost clear-cache
```

For a clean deploy: commit + push + rebuild the TLDM image.

---

## Versioning

This repo is the **source of truth** for the theme. The TLDM image build pulls `main` branch tip — version-pin by updating `TLDM_VERSION_PINS.txt` in `uma_erp` whenever you cut a release.
