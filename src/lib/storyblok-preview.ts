import {storyblokEditable} from '@storyblok/react/rsc'
import type {SbBlokData} from '@storyblok/js'

import {defaultStoryblokVersion} from '@/lib/storyblok'

export type SearchParams = Record<string, string | string[] | undefined>

/** Storyblok Visual Editor appends these query params to the preview iframe URL. */
export function isStoryblokPreview(searchParams?: SearchParams): boolean {
  if (!searchParams) return false
  return Object.keys(searchParams).some(
    (key) => key === '_storyblok' || key.startsWith('_storyblok_tk'),
  )
}

/** Visual Editor always needs draft content with `_editable` markers on bloks. */
export function getStoryblokVersion(searchParams?: SearchParams): 'draft' | 'published' {
  if (isStoryblokPreview(searchParams)) return 'draft'
  return defaultStoryblokVersion()
}

/** Merge live-editing story payload from the bridge (see @storyblok/react story cache). */
export function consumeCachedStory<T extends {id?: number}>(story: T): T {
  if (typeof story?.id !== 'number') return story
  const key = String(story.id)
  const cache = globalThis.storyCache as Map<string, Partial<T>> | undefined
  if (!cache?.has(key)) return story
  const cached = cache.get(key)
  cache.delete(key)
  return cached ? {...story, ...cached} : story
}

export type EditableAttrs = ReturnType<typeof storyblokEditable>

export function editableBlok(blok: unknown): EditableAttrs {
  if (!blok || typeof blok !== 'object') return {}
  return storyblokEditable(blok as SbBlokData)
}

export function firstBlok(value: unknown): SbBlokData | null {
  if (!Array.isArray(value) || !value[0] || typeof value[0] !== 'object') return null
  return value[0] as SbBlokData
}

export function blokArray(value: unknown): SbBlokData[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is SbBlokData => !!item && typeof item === 'object')
}

declare global {
  // eslint-disable-next-line no-var
  var storyCache: Map<string, unknown> | undefined
}

globalThis.storyCache = globalThis.storyCache ?? new Map()
