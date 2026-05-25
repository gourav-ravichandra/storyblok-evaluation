import {storyblokEditable} from '@storyblok/react/rsc'
import type {SbBlokData} from '@storyblok/js'

type VideoEmbedBlokData = SbBlokData & {
  url?: string
  caption?: string
}

export default function VideoEmbedBlok({blok}: {blok: VideoEmbedBlokData}) {
  if (!blok.url) return null

  return (
    <figure className="my-8" {...storyblokEditable(blok)}>
      <a
        href={blok.url}
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...storyblokEditable(blok)}
      >
        Watch video
      </a>
      {blok.caption && (
        <figcaption className="mt-2 text-sm text-slate-500" {...storyblokEditable(blok)}>
          {blok.caption}
        </figcaption>
      )}
    </figure>
  )
}
