import {notFound} from 'next/navigation'
import type {Metadata} from 'next'

import {content} from '@/lib/content/adapter'
import {
  buildCaseStudyMetadata,
  fetchCaseStudy,
  isCaseStudyLanguage,
  renderCaseStudyPage,
  type CaseStudyLanguage,
} from '@/lib/case-study-page'
import {getStoryblokVersion, isStoryblokPreview, type SearchParams} from '@/lib/storyblok-preview'

/** Preview uses `searchParams` (dynamic). Published pages can still be revalidated. */
export const revalidate = 60

/**
 * Storyblok preview URLs use the story full_slug path:
 *   /case-studies/en/{slug}
 */
export async function generateStaticParams() {
  const languages: CaseStudyLanguage[] = ['en', 'es', 'fr']
  const params: Array<{lang: string; slug: string}> = []

  for (const language of languages) {
    const slugs = await content.getAllSlugs({language, perspective: 'published', stega: false})
    for (const entry of slugs) {
      params.push({lang: language, slug: entry.slug})
    }
  }

  return params
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{lang: string; slug: string}>
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const {lang, slug} = await params
  if (!isCaseStudyLanguage(lang)) return {}

  const resolvedSearchParams = await searchParams
  const preview = isStoryblokPreview(resolvedSearchParams)
  const version = getStoryblokVersion(resolvedSearchParams)
  const caseStudy = await fetchCaseStudy(slug, lang, preview || version === 'draft')
  if (!caseStudy) return {}

  return {
    ...buildCaseStudyMetadata(caseStudy),
    alternates: {
      canonical: `/case-studies/${lang}/${slug}`,
    },
  }
}

export default async function CaseStudyByLanguagePage({
  params,
  searchParams,
}: {
  params: Promise<{lang: string; slug: string}>
  searchParams: Promise<SearchParams>
}) {
  const {lang, slug} = await params
  if (!isCaseStudyLanguage(lang)) notFound()
  return renderCaseStudyPage(slug, lang, await searchParams)
}
