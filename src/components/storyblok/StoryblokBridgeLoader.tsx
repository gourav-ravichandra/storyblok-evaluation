'use client'

import {useStoryblokBridge} from '@storyblok/react'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

import {STORYBLOK_RESOLVE_RELATIONS} from '@/lib/storyblok'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://storyblok-evaluation.vercel.app'

interface Props {
  storyId: number
}

/**
 * Connects the page to Storyblok's Visual Editor bridge.
 * Refreshes the route when content changes so edits appear live in the iframe.
 */
export function StoryblokBridgeLoader({storyId}: Props) {
  const router = useRouter()

  useStoryblokBridge(
    storyId,
    () => {
      router.refresh()
    },
    {
      resolveRelations: STORYBLOK_RESOLVE_RELATIONS.split(','),
      customParent: SITE_URL,
    },
  )

  // StoryblokBridgeLoader is only mounted in preview; show a subtle indicator.
  useEffect(() => {
    document.documentElement.dataset.storyblokPreview = 'true'
    return () => {
      delete document.documentElement.dataset.storyblokPreview
    }
  }, [])

  return null
}
