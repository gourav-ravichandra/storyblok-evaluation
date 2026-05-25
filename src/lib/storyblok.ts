import {apiPlugin, storyblokInit} from '@storyblok/react/rsc'
import type {StoryblokBridgeConfigV2} from '@storyblok/js'

import CalloutBlok from '@/components/storyblok/bloks/CalloutBlok'
import CaptionedImageBlok from '@/components/storyblok/bloks/CaptionedImageBlok'
import CaseStudyBlok from '@/components/storyblok/bloks/CaseStudyBlok'
import CustomerQuoteBlok from '@/components/storyblok/bloks/CustomerQuoteBlok'
import DataTableBlok from '@/components/storyblok/bloks/DataTableBlok'
import HeroBlok from '@/components/storyblok/bloks/HeroBlok'
import StatBlok from '@/components/storyblok/bloks/StatBlok'
import VideoEmbedBlok from '@/components/storyblok/bloks/VideoEmbedBlok'

const REGION = (process.env.STORYBLOK_REGION ?? 'eu') as 'eu' | 'us' | 'ca' | 'ap' | 'cn'

/**
 * Single Storyblok init — registers all blok components for `StoryblokStory` / `StoryblokServerComponent`.
 * @see https://github.com/storyblok/monoblok/tree/main/packages/react#nextjs-using-app-router
 */
export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  bridge: false,
  apiOptions: {
    region: REGION,
  },
  components: {
    case_study: CaseStudyBlok,
    stat: StatBlok,
    customer_quote: CustomerQuoteBlok,
    hero: HeroBlok,
    captioned_image: CaptionedImageBlok,
    callout: CalloutBlok,
    video_embed: VideoEmbedBlok,
    data_table: DataTableBlok,
  },
})

export const STORYBLOK_RESOLVE_RELATIONS = [
  'case_study.industries',
  'case_study.regions',
  'case_study.use_cases',
  'case_study.products_used',
  'case_study.author',
] as const

export const STORYBLOK_BRIDGE_OPTIONS: StoryblokBridgeConfigV2 = {
  resolveRelations: [...STORYBLOK_RESOLVE_RELATIONS],
}

export const STORYBLOK_FOLDER_PREFIX = 'case-studies'

export function storyblokFullSlug(language: string, slug: string): string {
  return `${STORYBLOK_FOLDER_PREFIX}/${language}/${slug}`
}

export function defaultStoryblokVersion(): 'draft' | 'published' {
  const env = process.env.NEXT_PUBLIC_STORYBLOK_VERSION ?? 'published'
  return env === 'draft' ? 'draft' : 'published'
}
