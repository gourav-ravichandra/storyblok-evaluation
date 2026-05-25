/**
 * Storyblok CDN adapter for the Modulr Resource Centre Next.js app.
 * Uses the shared `getStoryblokApi` instance from `@/lib/storyblok`.
 */

import type {CaseStudy, ContentAdapter} from '../types'
import {mapStoryblokToCaseStudy, type StoryblokStory} from './map-story'
import {
  defaultStoryblokVersion,
  storyblokFullSlug,
  STORYBLOK_FOLDER_PREFIX,
} from '@/lib/storyblok'
import {
  fetchStoryblokStoriesInFolder,
  fetchStoryblokStoryByFullSlug,
} from '@/lib/storyblok-fetch'

type Language = 'en' | 'es' | 'fr'

function parseLanguage(language?: string): Language {
  if (language === 'es' || language === 'fr') return language
  return 'en'
}

function versionForPreview(previewDraft?: boolean): 'draft' | 'published' {
  return previewDraft ? 'draft' : defaultStoryblokVersion()
}

async function getCaseStudyBySlugInternal(
  slug: string,
  language: Language,
  previewDraft?: boolean,
): Promise<CaseStudy | null> {
  const story = await fetchStoryblokStoryByFullSlug(
    storyblokFullSlug(language, slug),
    versionForPreview(previewDraft),
  )
  if (!story) return null
  return mapStoryblokToCaseStudy(story)
}

/** Raw Storyblok story for Visual Editor (`storyblokEditable` + live editing). */
export async function fetchRawStoryBySlug(
  slug: string,
  language: Language = 'en',
  version: 'draft' | 'published' = 'draft',
): Promise<StoryblokStory | null> {
  return fetchStoryblokStoryByFullSlug(storyblokFullSlug(language, slug), version)
}

async function getAllCaseStudiesInternal(
  language: Language,
  previewDraft = false,
): Promise<CaseStudy[]> {
  const folderPath = `${STORYBLOK_FOLDER_PREFIX}/${language}`
  const stories = await fetchStoryblokStoriesInFolder(
    folderPath,
    versionForPreview(previewDraft),
  )
  return stories
    .map((story) => mapStoryblokToCaseStudy(story))
    .filter((cs): cs is CaseStudy => cs != null)
}

export const storyblokAdapter: ContentAdapter = {
  async getCaseStudyBySlug(slug, options) {
    return getCaseStudyBySlugInternal(
      slug,
      parseLanguage(options?.language),
      options?.previewDraft,
    )
  },

  async getAllCaseStudies(options) {
    return getAllCaseStudiesInternal(parseLanguage(options?.language))
  },

  async getAllSlugs(options) {
    const language = parseLanguage(options?.language)
    const folderPath = `${STORYBLOK_FOLDER_PREFIX}/${language}`
    const stories = await fetchStoryblokStoriesInFolder(
      folderPath,
      options?.perspective === 'previewDrafts' ? 'draft' : defaultStoryblokVersion(),
    )
    return stories.map((s) => {
      const fullSlug = String(s.full_slug ?? '')
      const parts = fullSlug.split('/')
      return {slug: parts[parts.length - 1] ?? '', language}
    })
  },

  async getAllTaxonomyValues() {
    const caseStudies = await getAllCaseStudiesInternal('en')
    const sets = {
      industries: new Set<string>(),
      regions: new Set<string>(),
      useCases: new Set<string>(),
      productsUsed: new Set<string>(),
      companySizes: new Set<string>(),
    }
    for (const cs of caseStudies) {
      cs.taxonomy.industries.forEach((v) => sets.industries.add(v))
      cs.taxonomy.regions.forEach((v) => sets.regions.add(v))
      cs.taxonomy.useCases.forEach((v) => sets.useCases.add(v))
      cs.taxonomy.productsUsed.forEach((v) => sets.productsUsed.add(v))
      sets.companySizes.add(cs.taxonomy.companySize)
    }
    return {
      industries: [...sets.industries].sort(),
      regions: [...sets.regions].sort(),
      useCases: [...sets.useCases].sort(),
      productsUsed: [...sets.productsUsed].sort(),
      companySizes: [...sets.companySizes].sort(),
    }
  },
}
