/**
 * Maps a Storyblok story → CaseStudy (the canonical UI shape).
 */

import type {CaseStudy, PortableTextBlock} from '../types'
import {storyblokRichtextToPortableText} from './richtext-to-pt'

export interface StoryblokStory {
  id: number
  uuid: string
  name: string
  slug: string
  full_slug: string
  content: Record<string, unknown>
  published_at: string | null
  first_published_at: string | null
  updated_at: string
}

function extractSlug(fullSlug: string): string {
  const parts = fullSlug.split('/')
  return parts[parts.length - 1] ?? fullSlug
}

function asset(value: unknown): {url: string; alt: string} | null {
  if (!value) return null
  if (typeof value === 'string') return {url: value, alt: ''}
  if (typeof value === 'object' && value !== null && 'filename' in value) {
    const v = value as {filename?: string; alt?: string}
    if (v.filename) return {url: v.filename, alt: v.alt ?? ''}
  }
  return null
}

function relationTitle(rel: unknown): string | null {
  if (!rel) return null
  if (typeof rel === 'string') return null
  if (typeof rel === 'object' && rel !== null) {
    const r = rel as {content?: {title?: string}; name?: string}
    return r.content?.title ?? r.name ?? null
  }
  return null
}

function relationsAsTitles(rels: unknown): string[] {
  if (!Array.isArray(rels)) return []
  return rels.map(relationTitle).filter((t): t is string => !!t)
}

function estimateReadingTime(pt: PortableTextBlock[]): number {
  let charCount = 0
  for (const block of pt) {
    if (block._type !== 'block') continue
    const children = block.children as Array<{text?: string}> | undefined
    for (const child of children ?? []) {
      if (typeof child.text === 'string') charCount += child.text.length
    }
  }
  const words = Math.ceil(charCount / 5)
  return Math.max(1, Math.ceil(words / 220))
}

function extractCustomerQuote(body: PortableTextBlock[]): CaseStudy['customerQuote'] | undefined {
  const block = body.find((entry) => entry._type === 'customerQuote') as
    | {
        quote?: string
        attributionName?: string
        attributionRole?: string
      }
    | undefined

  if (!block?.quote || !block.attributionName || !block.attributionRole) return undefined

  return {
    quote: block.quote,
    attributionName: block.attributionName,
    attributionRole: block.attributionRole,
  }
}

function bodyWithoutExtractedQuote(body: PortableTextBlock[]): PortableTextBlock[] {
  if (!body.length) return []
  const hasStandaloneQuote = body.some((entry) => entry._type === 'customerQuote')
  if (!hasStandaloneQuote) return body
  return body.filter((entry) => entry._type !== 'customerQuote')
}

export function mapStoryblokToCaseStudy(story: StoryblokStory): CaseStudy | null {
  const c = story.content ?? {}
  const title = (c.title as string | undefined) ?? story.name ?? ''
  const slug = extractSlug(story.full_slug)

  if (!title || !slug) return null

  const rawBody = storyblokRichtextToPortableText(
    (c.body as {type?: string; content?: unknown[]}) ?? {type: 'doc', content: []},
  ) as PortableTextBlock[]

  const customerQuoteFromBlok = (() => {
    const quoteBlok = Array.isArray(c.customer_quote) ? c.customer_quote[0] : null
    if (!quoteBlok) return undefined
    const q = quoteBlok as {
      quote?: string
      attribution_name?: string
      attribution_role?: string
    }
    if (!q.quote || !q.attribution_name || !q.attribution_role) return undefined
    return {
      quote: q.quote,
      attributionName: q.attribution_name,
      attributionRole: q.attribution_role,
    }
  })()

  const customerQuote = customerQuoteFromBlok ?? extractCustomerQuote(rawBody)
  const body = bodyWithoutExtractedQuote(rawBody)

  const featuredImageRaw = asset(c.featured_image)
  const featuredImage = featuredImageRaw
    ? {
        url: featuredImageRaw.url,
        alt: (c.featured_image_alt as string | undefined) || featuredImageRaw.alt || '',
      }
    : null

  const stats = (Array.isArray(c.stats) ? c.stats : [])
    .filter((s): s is {value: string; label: string} => {
      if (!s || typeof s !== 'object') return false
      const row = s as {value?: string; label?: string}
      return Boolean(row.value && row.label)
    })
    .map((s) => ({value: s.value, label: s.label}))

  const seoBlok = Array.isArray(c.seo) ? c.seo[0] : null
  const seoOgImage = seoBlok?.og_image ? asset(seoBlok.og_image) : null
  const ogImage =
    seoOgImage != null
      ? {url: seoOgImage.url, alt: seoOgImage.alt}
      : featuredImage != null
        ? {url: featuredImage.url, alt: featuredImage.alt}
        : undefined

  const readingTimeMinutes =
    typeof c.reading_time_minutes === 'number' && c.reading_time_minutes > 0
      ? c.reading_time_minutes
      : estimateReadingTime(body)

  const companySize =
    (c.company_size as CaseStudy['taxonomy']['companySize'] | undefined) ?? 'SMB'

  return {
    slug,
    title,
    excerpt: (c.excerpt as string | undefined) ?? '',
    companyName: (c.company_name as string | undefined) ?? title,
    companyLogo: featuredImage,
    featuredImage,
    publishedAt:
      (c.published_at as string | undefined) ||
      story.first_published_at ||
      story.published_at ||
      null,
    updatedAt: (c.updated_at as string | undefined) || story.updated_at || null,
    language: (c.language as CaseStudy['language'] | undefined) ?? 'en',
    taxonomy: {
      industries: relationsAsTitles(c.industries),
      regions: relationsAsTitles(c.regions),
      useCases: relationsAsTitles(c.use_cases),
      productsUsed: relationsAsTitles(c.products_used),
      companySize,
    },
    stats,
    customerQuote,
    body,
    seo: {
      metaTitle: seoBlok?.meta_title as string | undefined,
      metaDescription:
        (seoBlok?.meta_description as string | undefined) ?? (c.excerpt as string | undefined),
      ogImage,
      noindex: Boolean(seoBlok?.noindex),
    },
    readingTimeMinutes,
    translations: [],
  }
}
