import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {StoryblokStory} from '@storyblok/react/rsc'
import type {ISbStoryData} from '@storyblok/js'

import {StoryblokPreviewBar} from '@/components/storyblok/StoryblokPreviewBar'
import {content} from '@/lib/content/adapter'
import {fetchRawStoryBySlug} from '@/lib/content/adapters/storyblok'
import type {CaseStudy} from '@/lib/content/types'
import {mapStoryblokToCaseStudy} from '@/lib/content/adapters/map-story'
import {STORYBLOK_BRIDGE_OPTIONS} from '@/lib/storyblok'
import {
  consumeCachedStory,
  getStoryblokVersion,
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

/**
 * Renders a case study via registered Storyblok components (`StoryblokStory`).
 * Enables per-blok and per-field click-to-edit in the Visual Editor.
 */
export async function renderCaseStudyPage(
  slug: string,
  language: CaseStudyLanguage = 'en',
  searchParams?: SearchParams,
): Promise<React.ReactNode> {
  const preview = isStoryblokPreview(searchParams)
  const version = getStoryblokVersion(searchParams)

  const raw = await fetchRawStoryBySlug(slug, language, version)
  if (!raw) notFound()

  const story = consumeCachedStory(raw)

  return (
    <>
      {preview && <StoryblokPreviewBar />}
      <StoryblokStory
        story={story as unknown as ISbStoryData}
        bridgeOptions={preview ? STORYBLOK_BRIDGE_OPTIONS : undefined}
      />
    </>
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
