import type {Metadata} from 'next'

import {content} from '@/lib/content/adapter'
import {
  buildCaseStudyMetadata,
  fetchCaseStudy,
  renderCaseStudyPage,
} from '@/lib/case-study-page'
import {isStoryblokPreview, type SearchParams} from '@/lib/storyblok-preview'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await content.getAllSlugs({perspective: 'published', stega: false})
  return slugs.map((entry) => ({slug: entry.slug}))
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{slug: string}>
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const {slug} = await params
  const preview = isStoryblokPreview(await searchParams)
  const caseStudy = await fetchCaseStudy(slug, 'en', preview)
  if (!caseStudy) return {}
  return buildCaseStudyMetadata(caseStudy)
}

export default async function CaseStudyPage({
  params,
  searchParams,
}: {
  params: Promise<{slug: string}>
  searchParams: Promise<SearchParams>
}) {
  const {slug} = await params
  return renderCaseStudyPage(slug, 'en', await searchParams)
}
