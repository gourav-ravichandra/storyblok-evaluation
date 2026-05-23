'use client'

import {apiPlugin, storyblokInit} from '@storyblok/react'

const REGION = (process.env.STORYBLOK_REGION ?? 'eu') as 'eu' | 'us' | 'ca' | 'ap' | 'cn'

/**
 * Must run in a client component so the Storyblok bridge script loads when
 * `_storyblok_tk` is present in the URL (Visual Editor iframe).
 */
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  bridge: true,
  apiOptions: {
    region: REGION,
  },
})

export default function StoryblokProvider({children}: {children: React.ReactNode}) {
  return children
}
