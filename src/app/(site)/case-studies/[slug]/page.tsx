import type {Metadata} from 'next'

import {content} from '@/lib/content/adapter'
import {
  buildCaseStudyMetadata,
  fetchCaseStudy,
  renderCaseStudyPage,
} from '@/lib/case-study-page'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await content.getAllSlugs({perspective: 'published', stega: false})
  return slugs.map((entry) => ({slug: entry.slug}))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const caseStudy = await fetchCaseStudy(slug)
  if (!caseStudy) return {}
  return buildCaseStudyMetadata(caseStudy)
}

export default async function CaseStudyPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  return renderCaseStudyPage(slug)
}
