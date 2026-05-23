'use client'

import {loadStoryblokBridge, useStoryblokBridge} from '@storyblok/react'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

interface Props {
  storyId: number
}

/**
 * Connects the page to Storyblok's Visual Editor bridge.
 * Loads the bridge script, then listens for input/change events so clicks
 * in the preview open the matching field and edits appear live.
 */
export function StoryblokBridgeLoader({storyId}: Props) {
  const router = useRouter()
  const [bridgeReady, setBridgeReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadStoryblokBridge()
      .then(() => {
        if (!cancelled) setBridgeReady(true)
      })
      .catch((err) => {
        console.error('[Storyblok] Failed to load bridge:', err)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useStoryblokBridge(
    storyId,
    () => {
      router.refresh()
    },
  )

  useEffect(() => {
    if (!bridgeReady) return
    document.documentElement.dataset.storyblokPreview = 'true'
    return () => {
      delete document.documentElement.dataset.storyblokPreview
    }
  }, [bridgeReady])

  return null
}
