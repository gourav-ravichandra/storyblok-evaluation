/**
 * Storyblok CDN adapter for the Modulr Resource Centre Next.js app.
 */

import StoryblokClient from 'storyblok-js-client'

import type {CaseStudy, ContentAdapter} from '../types'
import {mapStoryblokToCaseStudy, type StoryblokStory} from './map-story'

const TOKEN = process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN
const VERSION = (process.env.NEXT_PUBLIC_STORYBLOK_VERSION ?? 'published') as
  | 'published'
  | 'draft'
const REGION = (process.env.STORYBLOK_REGION ?? 'eu') as 'eu' | 'us' | 'ca' | 'ap' | 'cn'

let _client: StoryblokClient | null = null

function getClient(): StoryblokClient {
  if (_client) return _client
  if (!TOKEN) {
    throw new Error(
      'NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN is missing. Set it in web/.env.local.',
    )
  }
  _client = new StoryblokClient({
    accessToken: TOKEN,
    region: REGION,
    cache: {clear: 'auto', type: 'memory'},
  })
  return _client
}

const FOLDER_PREFIX = 'case-studies'

const CASE_STUDY_RESOLVE_RELATIONS = [
  'case_study.industries',
  'case_study.regions',
  'case_study.use_cases',
  'case_study.products_used',
  'case_study.author',
].join(',')

type Language = 'en' | 'es' | 'fr'

function parseLanguage(language?: string): Language {
  if (language === 'es' || language === 'fr') return language
  return 'en'
}

interface FetchOptions {
  version?: 'published' | 'draft'
}

async function fetchStoryBySlug(
  fullSlug: string,
  options: FetchOptions = {},
): Promise<Record<string, unknown> | null> {
  try {
    const {data} = await getClient().get(`cdn/stories/${fullSlug}`, {
      version: options.version ?? VERSION,
      resolve_relations: CASE_STUDY_RESOLVE_RELATIONS,
      cv: Math.floor(Date.now() / 1000),
    })
    return (data as {story?: Record<string, unknown>})?.story ?? null
  } catch (err: unknown) {
    const error = err as {status?: number; response?: {status?: number}}
    if (error.status === 404 || error.response?.status === 404) return null
    throw err
  }
}

async function fetchAllStoriesUnderFolder(
  folderPath: string,
  options: FetchOptions = {},
): Promise<Record<string, unknown>[]> {
  const stories: Record<string, unknown>[] = []
  let page = 1
  const perPage = 100

  while (true) {
    const {data} = await getClient().get('cdn/stories', {
      starts_with: folderPath,
      version: options.version ?? VERSION,
      resolve_relations: CASE_STUDY_RESOLVE_RELATIONS,
      filter_query: {
        component: {in: 'case_study'},
      },
      per_page: perPage,
      page,
      cv: Math.floor(Date.now() / 1000),
      sort_by: 'first_published_at:desc',
    })

    const batch = (data as {stories?: Record<string, unknown>[]})?.stories ?? []
    stories.push(...batch)
    if (batch.length < perPage) break
    page += 1
  }

  return stories
}

async function getCaseStudyBySlugInternal(
  slug: string,
  language: Language,
  previewDraft?: boolean,
): Promise<CaseStudy | null> {
  const fullSlug = `${FOLDER_PREFIX}/${language}/${slug}`
  const useDraft = previewDraft ?? false
  const story = await fetchStoryBySlug(fullSlug, {
    version: useDraft ? 'draft' : VERSION,
  })
  if (!story) return null
  return mapStoryblokToCaseStudy(story as unknown as StoryblokStory)
}

/** Raw Storyblok story for Visual Editor bridge + storyblokEditable attributes. */
export async function fetchRawStoryBySlug(
  slug: string,
  language: Language = 'en',
  previewDraft = true,
): Promise<StoryblokStory | null> {
  const fullSlug = `${FOLDER_PREFIX}/${language}/${slug}`
  const story = await fetchStoryBySlug(fullSlug, {
    version: previewDraft ? 'draft' : VERSION,
  })
  return story ? (story as unknown as StoryblokStory) : null
}

async function getAllCaseStudiesInternal(
  language: Language,
  previewDraft = false,
): Promise<CaseStudy[]> {
  const folderPath = `${FOLDER_PREFIX}/${language}`
  const stories = await fetchAllStoriesUnderFolder(folderPath, {
    version: previewDraft ? 'draft' : VERSION,
  })
  return stories
    .map((story) => mapStoryblokToCaseStudy(story as unknown as StoryblokStory))
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
    const folderPath = `${FOLDER_PREFIX}/${language}`
    const stories = await fetchAllStoriesUnderFolder(folderPath, {
      version: options?.perspective === 'previewDrafts' ? 'draft' : VERSION,
    })
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
