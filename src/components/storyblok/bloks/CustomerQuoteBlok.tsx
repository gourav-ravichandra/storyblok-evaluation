import {storyblokEditable} from '@storyblok/react/rsc'
import type {SbBlokData} from '@storyblok/js'

type CustomerQuoteBlokData = SbBlokData & {
  quote?: string
  attribution_name?: string
  attribution_role?: string
}

export default function CustomerQuoteBlok({blok}: {blok: CustomerQuoteBlokData}) {
  return (
    <blockquote
      className="relative rounded-2xl border border-blue-100 bg-blue-50/60 p-8"
      {...storyblokEditable(blok)}
    >
      <span
        aria-hidden
        className="absolute left-6 top-4 text-6xl leading-none text-blue-200"
      >
        “
      </span>
      <p
        className="relative z-10 text-lg italic leading-relaxed text-slate-800"
        {...storyblokEditable(blok)}
      >
        {blok.quote}
      </p>
      <footer className="relative z-10 mt-6 border-t border-blue-100 pt-4">
        <cite className="not-italic">
          <span
            className="block font-semibold text-slate-900"
            {...storyblokEditable(blok)}
          >
            {blok.attribution_name}
          </span>
          <span className="text-sm text-slate-600" {...storyblokEditable(blok)}>
            {blok.attribution_role}
          </span>
        </cite>
      </footer>
    </blockquote>
  )
}
