import {apiPlugin, storyblokInit} from '@storyblok/react/rsc'

const REGION = (process.env.STORYBLOK_REGION ?? 'eu') as 'eu' | 'us' | 'ca' | 'ap' | 'cn'

/** Server-side Storyblok init (bridge is loaded separately on the client). */
export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  bridge: false,
  apiOptions: {
    region: REGION,
  },
})

export const STORYBLOK_RESOLVE_RELATIONS = [
  'case_study.industries',
  'case_study.regions',
  'case_study.use_cases',
  'case_study.products_used',
  'case_study.author',
].join(',')
