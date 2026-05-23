import Image from 'next/image'
import {PortableText, type PortableTextComponents} from '@portabletext/react'

import {CaseStudyQuote} from '@/components/case-studies/CaseStudyQuote'
import type {PortableTextBlock} from '@/lib/content/types'

function imageUrlFromValue(value: {
  image?: {asset?: {url?: string}}
  asset?: {url?: string}
}): string | null {
  return value?.image?.asset?.url ?? value?.asset?.url ?? null
}

const components: PortableTextComponents = {
  block: {
    h2: ({children}) => (
      <h2 className="mb-4 mt-8 text-2xl font-bold text-slate-900">{children}</h2>
    ),
    h3: ({children}) => (
      <h3 className="mb-3 mt-6 text-xl font-semibold text-slate-900">{children}</h3>
    ),
    h4: ({children}) => (
      <h4 className="mb-2 mt-4 text-lg font-semibold text-slate-900">{children}</h4>
    ),
    blockquote: ({children}) => (
      <blockquote className="my-6 border-l-4 border-blue-500 pl-4 italic text-slate-700">
        {children}
      </blockquote>
    ),
    normal: ({children}) => (
      <p className="mb-4 leading-relaxed text-slate-700">{children}</p>
    ),
  },
  list: {
    bullet: ({children}) => <ul className="mb-4 list-disc space-y-2 pl-6">{children}</ul>,
    number: ({children}) => <ol className="mb-4 list-decimal space-y-2 pl-6">{children}</ol>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold text-slate-900">{children}</strong>,
    em: ({children}) => <em>{children}</em>,
    code: ({children}) => (
      <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">{children}</code>
    ),
    link: ({value, children}) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={
          value?.rel ??
          (value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined)
        }
        className="text-blue-600 hover:underline"
      >
        {children}
      </a>
    ),
  },
  types: {
    captionedImage: ({value}) => {
      const src = imageUrlFromValue(value ?? {})
      if (!src) return null
      return (
        <figure className="my-8">
          <Image
            src={src}
            alt={(value?.alt as string | undefined) ?? ''}
            width={1200}
            height={675}
            className="w-full rounded-lg"
          />
          {value?.caption && (
            <figcaption className="mt-2 text-center text-sm text-slate-500">
              {String(value.caption)}
            </figcaption>
          )}
        </figure>
      )
    },
    customerQuote: ({value}) =>
      value?.quote ? (
        <div className="my-8">
          <CaseStudyQuote quote={value as Parameters<typeof CaseStudyQuote>[0]['quote']} />
        </div>
      ) : null,
    callout: ({value}) => {
      const type = (value?.type ?? value?.calloutType ?? 'info') as string
      return (
        <aside
          className={`my-6 rounded-lg border p-4 ${
            type === 'warning'
              ? 'border-amber-200 bg-amber-50'
              : type === 'success'
                ? 'border-green-200 bg-green-50'
                : type === 'tip'
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-slate-200 bg-slate-50'
          }`}
        >
          {value?.title && <p className="mb-2 font-semibold text-slate-900">{String(value.title)}</p>}
          {Array.isArray(value?.body) && (
            <PortableText value={value.body as PortableTextBlock[]} components={components} />
          )}
        </aside>
      )
    },
    stat: ({value}) =>
      value?.value ? (
        <div className="my-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">
            {value.prefix}
            {value.value}
          </p>
          {value.label && <p className="text-sm text-slate-600">{String(value.label)}</p>}
        </div>
      ) : null,
    videoEmbed: ({value}) =>
      value?.url ? (
        <figure className="my-8">
          <a
            href={String(value.url)}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch video
          </a>
          {value.caption && (
            <figcaption className="mt-2 text-sm text-slate-500">{String(value.caption)}</figcaption>
          )}
        </figure>
      ) : null,
    dataTable: ({value}) => {
      const rows = (value?.rows as Array<{cells?: string[]}> | undefined) ?? []
      if (!rows.length) return null
      return (
        <div className="my-8 overflow-x-auto">
          <table className="min-w-full border-collapse border border-slate-200 text-sm">
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-slate-200">
                  {(row.cells ?? []).map((cell, cellIndex) => {
                    const Tag = value?.hasHeaderRow && rowIndex === 0 ? 'th' : 'td'
                    return (
                      <Tag key={cellIndex} className="border border-slate-200 px-3 py-2 text-left">
                        {cell}
                      </Tag>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
  },
}

export function PortableTextRenderer({value}: {value: PortableTextBlock[]}) {
  return <PortableText value={value} components={components} />
}
