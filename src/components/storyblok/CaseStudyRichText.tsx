import {StoryblokServerRichText} from '@storyblok/react/rsc'
import type {StoryblokRichTextProps} from '@storyblok/react/rsc'

interface Props {
  doc: unknown
  className?: string
}

/**
 * Renders case study body richtext with embedded bloks wired to registered components.
 */
export function CaseStudyRichText({doc, className = 'prose prose-slate max-w-none'}: Props) {
  if (!doc || typeof doc !== 'object') return null

  return (
    <div className={className}>
      <StoryblokServerRichText doc={doc as StoryblokRichTextProps['doc']} />
    </div>
  )
}
