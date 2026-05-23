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

## Visual Editor (click-to-edit preview)

The app supports Storyblok's Visual Editor — similar to Sanity Presentation. When you open a case study in Storyblok, the preview iframe loads your site with click-to-edit overlays on title, excerpt, stats, quote, and body.

### Storyblok space setup

1. **Settings → Visual Editor** — set default environment to:
   ```
   https://storyblok-evaluation.vercel.app/
   ```
2. Preview URL pattern (per story type or folder):
   ```
   https://storyblok-evaluation.vercel.app/case-studies/{lang}/{slug}
   ```

### Vercel env

Add to your Vercel project (required for the bridge iframe in production):

```
NEXT_PUBLIC_SITE_URL=https://storyblok-evaluation.vercel.app
```

### Local visual editing

Storyblok requires HTTPS for local preview. Run:

```bash
npm run dev -- --experimental-https
```

Then set the Visual Editor default environment to `https://localhost:3000/` in Storyblok.

See [Storyblok Visual Preview docs](https://www.storyblok.com/docs/guides/nextjs/visual-preview).

## Prerequisites

1. `storyblok-setup` — components and folder tree in your space
2. `storyblok-push` — case studies imported under `case-studies/en/`
