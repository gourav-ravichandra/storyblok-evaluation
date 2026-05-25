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

## Storyblok components (click-to-edit)

Case study pages render through **`StoryblokStory`**, which maps each Storyblok component to a React server component registered in `src/lib/storyblok.ts`:

| Storyblok component | React component | Click target |
|---------------------|-----------------|--------------|
| `case_study` | `CaseStudyBlok` | Title, excerpt, company, featured image (per-field wrappers) |
| `stat` | `StatBlok` | Value + label (stats strip and body embeds) |
| `customer_quote` | `CustomerQuoteBlok` | Quote, attribution (sidebar blok or body embed) |
| `hero` | `HeroBlok` | Hero image/video blok |
| Body embeds | `CaptionedImageBlok`, `CalloutBlok`, `VideoEmbedBlok`, `DataTableBlok` | Each embedded blok in richtext via `StoryblokServerRichText` |

The listing page still uses `mapStoryblokToCaseStudy` for cards (no visual editor needed).

## Visual Editor

1. **Settings → Visual Editor** — default environment:
   ```
   https://storyblok-evaluation.vercel.app/
   ```
2. Preview URL pattern:
   ```
   https://storyblok-evaluation.vercel.app/case-studies/{lang}/{slug}
   ```
   `/case-studies/{slug}` redirects to `/case-studies/en/{slug}`.

### Vercel env

- `NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN` (required)
- `STORYBLOK_REGION=eu`
- `NEXT_PUBLIC_STORYBLOK_VERSION=published` for production traffic (Visual Editor still loads **draft** automatically)

Do **not** set `NEXT_PUBLIC_SITE_URL` unless you white-label the Storyblok app.

### Local HTTPS

```bash
npm run dev -- --experimental-https
```

Set Visual Editor to `https://localhost:3000/`.

See [Storyblok Visual Preview](https://www.storyblok.com/docs/guides/nextjs/visual-preview).

## Prerequisites

1. `storyblok-setup` — components and folder tree
2. `storyblok-push` — case studies under `case-studies/en/`
