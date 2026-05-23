# Modulr Resource Centre — Web UI (Storyblok)

Next.js frontend for the Modulr case study resource centre, powered by Storyblok.

Based on the Sanity evaluation app; uses the same UI components with the Storyblok adapter from `web-adapter/`.

## Setup

```bash
cd web
npm install
cp .env.example .env.local
```

Add your **Preview API token** to `.env.local` (Storyblok → Settings → Access Tokens). This is different from the Management API token used by `storyblok-setup` and `storyblok-push`.

If case studies are still drafts, set:

```
NEXT_PUBLIC_STORYBLOK_VERSION=draft
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000/case-studies](http://localhost:3000/case-studies).

## Prerequisites

1. `storyblok-setup` — components and folder tree in your space
2. `storyblok-push` — case studies imported under `case-studies/en/`
