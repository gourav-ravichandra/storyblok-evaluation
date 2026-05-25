import {storyblokEditable} from '@storyblok/react/rsc'
import type {SbBlokData} from '@storyblok/js'

type StatBlokData = SbBlokData & {
  value?: string
  label?: string
}

export default function StatBlok({blok}: {blok: StatBlokData}) {
  return (
    <article
      className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center"
      {...storyblokEditable(blok)}
    >
      <p className="text-3xl font-bold text-slate-900" {...storyblokEditable(blok)}>
        {blok.value}
      </p>
      <p className="mt-2 text-sm text-slate-600" {...storyblokEditable(blok)}>
        {blok.label}
      </p>
    </article>
  )
}
