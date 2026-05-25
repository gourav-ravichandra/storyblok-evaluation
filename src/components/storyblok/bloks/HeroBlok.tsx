import Image from 'next/image'
import {storyblokEditable} from '@storyblok/react/rsc'
import type {SbBlokData} from '@storyblok/js'

import {storyblokAsset} from '@/lib/storyblok/asset'

type HeroBlokData = SbBlokData & {
  hero_type?: 'image' | 'video'
  image?: {filename?: string; alt?: string}
  image_alt?: string
  video_url?: string
  video_caption?: string
}

function isSvg(url: string) {
  return url.toLowerCase().includes('.svg')
}

export default function HeroBlok({blok}: {blok: HeroBlokData}) {
  const image = storyblokAsset(blok.image, blok.image_alt ?? '')

  if (blok.hero_type === 'video' && blok.video_url) {
    return (
      <figure className="w-full" {...storyblokEditable(blok)}>
        <a
          href={blok.video_url}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          {...storyblokEditable(blok)}
        >
          Watch video
        </a>
        {blok.video_caption && (
          <figcaption className="mt-2 text-sm text-slate-500" {...storyblokEditable(blok)}>
            {blok.video_caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if (!image?.url) return null

  return (
    <div {...storyblokEditable(blok)}>
      {isSvg(image.url) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.url} alt={image.alt} className="max-h-24 w-full object-contain" />
      ) : (
        <Image
          src={image.url}
          alt={image.alt}
          width={240}
          height={96}
          className="max-h-24 w-auto object-contain"
        />
      )}
    </div>
  )
}
