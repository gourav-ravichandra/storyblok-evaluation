import Image from 'next/image'
import {storyblokEditable} from '@storyblok/react/rsc'
import type {SbBlokData} from '@storyblok/js'

import {storyblokAsset} from '@/lib/storyblok/asset'

type CaptionedImageBlokData = SbBlokData & {
  image?: {filename?: string; alt?: string}
  alt?: string
  caption?: string
  credit?: string
}

export default function CaptionedImageBlok({blok}: {blok: CaptionedImageBlokData}) {
  const image = storyblokAsset(blok.image, blok.alt ?? '')
  if (!image?.url) return null

  return (
    <figure className="my-8" {...storyblokEditable(blok)}>
      <Image
        src={image.url}
        alt={image.alt}
        width={1200}
        height={675}
        className="w-full rounded-lg"
      />
      {blok.caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-500" {...storyblokEditable(blok)}>
          {blok.caption}
          {blok.credit ? ` · ${blok.credit}` : ''}
        </figcaption>
      )}
    </figure>
  )
}
