import {storyblokEditable} from '@storyblok/react/rsc'
import type {SbBlokData} from '@storyblok/js'

import {CaseStudyRichText} from '@/components/storyblok/CaseStudyRichText'

type CalloutBlokData = SbBlokData & {
  callout_type?: 'info' | 'tip' | 'warning' | 'success'
  title?: string
  body?: {type?: string; content?: unknown[]}
}

const styles: Record<string, string> = {
  warning: 'border-amber-200 bg-amber-50',
  success: 'border-green-200 bg-green-50',
  tip: 'border-blue-200 bg-blue-50',
  info: 'border-slate-200 bg-slate-50',
}

export default function CalloutBlok({blok}: {blok: CalloutBlokData}) {
  const type = blok.callout_type ?? 'info'

  return (
    <aside
      className={`my-6 rounded-lg border p-4 ${styles[type] ?? styles.info}`}
      {...storyblokEditable(blok)}
    >
      {blok.title && (
        <p className="mb-2 font-semibold text-slate-900" {...storyblokEditable(blok)}>
          {blok.title}
        </p>
      )}
      {blok.body && <CaseStudyRichText doc={blok.body} className="prose prose-sm max-w-none" />}
    </aside>
  )
}
