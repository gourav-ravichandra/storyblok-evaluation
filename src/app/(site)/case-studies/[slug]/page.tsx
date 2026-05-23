import {notFound} from 'next/navigation'
import type {Metadata} from 'next'

import {CaseStudyHero} from '@/components/case-studies/CaseStudyHero'
import {CaseStudyQuote} from '@/components/case-studies/CaseStudyQuote'
import {CaseStudyStats} from '@/components/case-studies/CaseStudyStats'
import {PortableTextRenderer} from '@/components/case-studies/PortableTextRenderer'
import {content} from '@/lib/content/adapter'

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
  const caseStudy = await content.getCaseStudyBySlug(slug)
  if (!caseStudy) return {}

  return {
    title: caseStudy.seo.metaTitle ?? `${caseStudy.title} | Modulr`,
    description: caseStudy.seo.metaDescription ?? caseStudy.excerpt,
    robots: caseStudy.seo.noindex ? {index: false, follow: false} : undefined,
    openGraph: {
      title: caseStudy.seo.metaTitle ?? caseStudy.title,
      description: caseStudy.seo.metaDescription ?? caseStudy.excerpt,
      images: caseStudy.seo.ogImage
        ? [{url: caseStudy.seo.ogImage.url, alt: caseStudy.seo.ogImage.alt}]
        : caseStudy.featuredImage
          ? [{url: caseStudy.featuredImage.url, alt: caseStudy.featuredImage.alt}]
          : [],
    },
  }
}

export default async function CaseStudyPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const caseStudy = await content.getCaseStudyBySlug(slug)
  if (!caseStudy) notFound()

  return (
    <>
      <CaseStudyHero caseStudy={caseStudy} />
      {caseStudy.stats.length > 0 && <CaseStudyStats stats={caseStudy.stats} />}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none">
          <PortableTextRenderer value={caseStudy.body} />
        </div>
        {caseStudy.customerQuote && (
          <div className="mt-12">
            <CaseStudyQuote quote={caseStudy.customerQuote} />
          </div>
        )}
      </article>
    </>
  )
}
