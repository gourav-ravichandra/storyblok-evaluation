import {storyblokEditable} from '@storyblok/react/rsc'
import type {SbBlokData} from '@storyblok/js'

export type SearchParams = Record<string, string | string[] | undefined>

/** Storyblok Visual Editor appends these query params to the preview iframe URL. */
export function isStoryblokPreview(searchParams?: SearchParams): boolean {
  if (!searchParams) return false
  return '_storyblok' in searchParams || '_storyblok_tk' in searchParams
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
