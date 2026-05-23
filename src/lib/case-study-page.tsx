import {notFound} from 'next/navigation'
import type {Metadata} from 'next'

import {CaseStudyHero} from '@/components/case-studies/CaseStudyHero'
import {CaseStudyQuote} from '@/components/case-studies/CaseStudyQuote'
import {CaseStudyStats} from '@/components/case-studies/CaseStudyStats'
import {PortableTextRenderer} from '@/components/case-studies/PortableTextRenderer'
import {StoryblokBridgeLoader} from '@/components/storyblok/StoryblokBridgeLoader'
import {StoryblokPreviewBar} from '@/components/storyblok/StoryblokPreviewBar'
import {content} from '@/lib/content/adapter'
import {fetchRawStoryBySlug} from '@/lib/content/adapters/storyblok'
import type {CaseStudy} from '@/lib/content/types'
import {
  blokArray,
  editableBlok,
  firstBlok,
  isStoryblokPreview,
  type SearchParams,
} from '@/lib/storyblok-preview'

const SUPPORTED_LANGUAGES = ['en', 'es', 'fr'] as const
export type CaseStudyLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export function isCaseStudyLanguage(value: string): value is CaseStudyLanguage {
  return SUPPORTED_LANGUAGES.includes(value as CaseStudyLanguage)
}

export async function fetchCaseStudy(
  slug: string,
  language: CaseStudyLanguage = 'en',
  previewDraft = false,
): Promise<CaseStudy | null> {
  return content.getCaseStudyBySlug(slug, {language, previewDraft})
}

interface PageViewProps {
  caseStudy: CaseStudy
  preview: boolean
  rawContent?: Record<string, unknown> | null
  storyId?: number
}

export function CaseStudyPageView({caseStudy, preview, rawContent, storyId}: PageViewProps) {
  const rootBlok = preview ? rawContent : null
  const statBloks = blokArray(rootBlok?.stats)
  const quoteBlok = firstBlok(rootBlok?.customer_quote)
  const rootEditable = rootBlok ? editableBlok(rootBlok) : {}

  return (
    <>
      {preview && storyId != null && <StoryblokBridgeLoader storyId={storyId} />}
      {preview && <StoryblokPreviewBar />}

      <main {...rootEditable}>
        <CaseStudyHero
          caseStudy={caseStudy}
          editable={
            rootBlok
              ? {
                  featuredImage: rootEditable,
                  title: rootEditable,
                  excerpt: rootEditable,
                  companyName: rootEditable,
                }
              : undefined
          }
        />

        {caseStudy.stats.length > 0 && (
          <CaseStudyStats
            stats={caseStudy.stats}
            editable={statBloks.map((blok) => editableBlok(blok))}
          />
        )}

        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none" {...rootEditable}>
            <PortableTextRenderer value={caseStudy.body} />
          </div>
          {caseStudy.customerQuote && (
            <div className="mt-12">
              <CaseStudyQuote
                quote={caseStudy.customerQuote}
                editable={quoteBlok ? editableBlok(quoteBlok) : undefined}
              />
            </div>
          )}
        </article>
      </main>
    </>
  )
}

export async function renderCaseStudyPage(
  slug: string,
  language: CaseStudyLanguage = 'en',
  searchParams?: SearchParams,
): Promise<React.ReactNode> {
  const preview = isStoryblokPreview(searchParams)

  const [caseStudy, rawStory] = await Promise.all([
    fetchCaseStudy(slug, language, preview),
    preview ? fetchRawStoryBySlug(slug, language, true) : Promise.resolve(null),
  ])

  if (!caseStudy) notFound()

  return (
    <CaseStudyPageView
      caseStudy={caseStudy}
      preview={preview}
      rawContent={rawStory?.content ?? null}
      storyId={rawStory?.id}
    />
  )
}

export function buildCaseStudyMetadata(caseStudy: CaseStudy): Metadata {
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
