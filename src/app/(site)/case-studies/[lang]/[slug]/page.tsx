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

export const revalidate = 60

/**
 * Storyblok preview URLs use the story full_slug path:
 *   /case-studies/en/{slug}
 * Public site URLs omit the language folder:
 *   /case-studies/{slug}
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
}: {
  params: Promise<{lang: string; slug: string}>
}): Promise<Metadata> {
  const {lang, slug} = await params
  if (!isCaseStudyLanguage(lang)) return {}

  const caseStudy = await fetchCaseStudy(slug, lang)
  if (!caseStudy) return {}

  return {
    ...buildCaseStudyMetadata(caseStudy),
    alternates: {
      canonical: `/case-studies/${slug}`,
    },
  }
}

export default async function CaseStudyByLanguagePage({
  params,
}: {
  params: Promise<{lang: string; slug: string}>
}) {
  const {lang, slug} = await params
  if (!isCaseStudyLanguage(lang)) notFound()
  return renderCaseStudyPage(slug, lang)
}
