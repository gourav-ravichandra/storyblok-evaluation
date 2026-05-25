import {unstable_noStore as noStore} from 'next/cache'

import type {StoryblokStory} from '@/lib/content/adapters/map-story'
import {
  defaultStoryblokVersion,
  getStoryblokApi,
  STORYBLOK_RESOLVE_RELATIONS,
} from '@/lib/storyblok'

type Version = 'draft' | 'published'

function cacheBust(version: Version): number | undefined {
  return version === 'draft' ? Math.floor(Date.now() / 1000) : undefined
}

async function storyblokGet<T>(path: string, params: Record<string, unknown>): Promise<T> {
  const api = getStoryblokApi()
  const {data} = await api.get(path, params)
  return data as T
}

export async function fetchStoryblokStoryByFullSlug(
  fullSlug: string,
  version: Version = defaultStoryblokVersion(),
): Promise<StoryblokStory | null> {
  if (version === 'draft') noStore()

  try {
    const data = await storyblokGet<{story?: StoryblokStory}>(`cdn/stories/${fullSlug}`, {
      version,
      resolve_relations: STORYBLOK_RESOLVE_RELATIONS.join(','),
      cv: cacheBust(version),
    })
    return data.story ?? null
  } catch (err: unknown) {
    const error = err as {status?: number; response?: {status?: number}}
    if (error.status === 404 || error.response?.status === 404) return null
    throw err
  }
}

export async function fetchStoryblokStoriesInFolder(
  folderPath: string,
  version: Version = defaultStoryblokVersion(),
): Promise<StoryblokStory[]> {
  if (version === 'draft') noStore()

  const stories: StoryblokStory[] = []
  let page = 1
  const perPage = 100

  while (true) {
    const data = await storyblokGet<{stories?: StoryblokStory[]}>('cdn/stories', {
      starts_with: folderPath,
      version,
      resolve_relations: STORYBLOK_RESOLVE_RELATIONS.join(','),
      filter_query: {component: {in: 'case_study'}},
      per_page: perPage,
      page,
      cv: cacheBust(version),
      sort_by: 'first_published_at:desc',
    })

    const batch = data.stories ?? []
    stories.push(...batch)
    if (batch.length < perPage) break
    page += 1
  }

  return stories
}
