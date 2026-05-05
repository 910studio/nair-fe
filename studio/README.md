# Nair Entertainment — Sanity Studio

The CMS lives here. Edits made in this Studio publish to `nair-final.vercel.app`.

## First-time setup (one time, by Gray)

```bash
# 1. install workspace deps (run from repo root)
pnpm install

# 2. log into Sanity (interactive — opens browser)
cd studio
pnpm dlx sanity@latest login

# 3. create the Sanity project (interactive)
pnpm dlx sanity@latest init --env
#   - "Create new project" → name it "Nair Entertainment"
#   - dataset: production (public reads)
#   - output path: ./ (current dir)
#   - generate config: yes
#   - this writes ./.env with SANITY_STUDIO_PROJECT_ID + DATASET

# 4. mirror the project ID into the SvelteKit app's .env
# (root .env, NOT studio/.env)
cd ..
cat > .env <<EOF
PUBLIC_SANITY_PROJECT_ID=<the project id from studio/.env>
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2024-10-01
EOF

# 5. seed the starter content (services + 2 seasons + 2 FAQs)
# generate a write token first: manage.sanity.io → API → Tokens → "Editor"
# add it to studio/.env as SANITY_WRITE_TOKEN=…
cd studio
pnpm seed

# 6. deploy the Studio so Nair team can log in
pnpm deploy
# → live at https://nair-cms.sanity.studio
```

## Inviting the Nair editor

1. Go to **manage.sanity.io** → your project → **Members** → **Invite member**
2. Enter Nair guy's email, role: **Editor** (can publish, can't break schema/users)
3. They get an invite, set a password, log in at `https://nair-cms.sanity.studio`

## Daily dev

```bash
# Studio locally (http://localhost:3333)
cd studio && pnpm dev

# SvelteKit site (http://localhost:5173)
cd .. && pnpm dev
```

## What's where

- `sanity.config.ts` — Studio config (plugins, schemas, singleton handling)
- `sanity.cli.ts` — CLI config (project id + studio host name)
- `structure.ts` — Custom desk layout (Featured / Upcoming / Past event lists, etc.)
- `schemas/` — All document and object types
  - `singletons/` — `siteSettings`, `heroSection` (one of each, never duplicated)
  - `documents/` — `event`, `season`, `service`, `faqItem`
  - `objects/` — `localizedString`, `localizedText`, `localizedRichText`
- `scripts/seed.ts` — One-shot seed, idempotent (safe to re-run)

## i18n

Every editable string is `localizedString` (`{ en, mn }`). Editors fill both columns
in the Studio. The SvelteKit app picks the active locale via `t(value, locale)` from
`$lib/sanity/i18n`.
