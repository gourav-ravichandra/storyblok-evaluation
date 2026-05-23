/**
 * Convert Storyblok Richtext (ProseMirror-shaped) → Sanity Portable Text.
 *
 * This is the REVERSE of storyblok-push's richtext-converter.ts. Letting the
 * adapter map back to Portable Text means we don't have to touch the existing
 * PortableTextRenderer.tsx in web/ — the same component renders body content
 * whether it came from Sanity or Storyblok.
 *
 * Storyblok richtext shape (input):
 *   { type: 'doc', content: [...nodes] }
 *   Nodes: paragraph, heading{level}, bullet_list, ordered_list, list_item,
 *          blockquote, code_block, blok (for embedded components), hard_break, image
 *   Marks: bold, italic, underline, strike, code, link
 *
 * Portable Text shape (output):
 *   Array of blocks
 *   { _type: 'block', _key, style, listItem?, level?, children: [...spans], markDefs: [...] }
 *   Custom types for embedded blocks: { _type: 'customerQuote' | 'callout' | ... }
 */

interface SbInline {
  type: string
  text?: string
  marks?: Array<{ type: string; attrs?: Record<string, any> }>
}

interface SbNode {
  type: string
  attrs?: Record<string, any>
  content?: SbNode[]
  [k: string]: any
}

interface SbDoc {
  type: 'doc'
  content: SbNode[]
}

interface PtSpan {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

interface PtMarkDef {
  _key: string
  _type: string
  href?: string
  [k: string]: any
}

interface PtBlock {
  _type: string
  _key: string
  style?: string
  listItem?: 'bullet' | 'number'
  level?: number
  children?: PtSpan[]
  markDefs?: PtMarkDef[]
  [k: string]: any
}

let keyCounter = 0
function makeKey(): string {
  keyCounter += 1
  return `k${Date.now().toString(36)}-${keyCounter}`
}

export function storyblokRichtextToPortableText(doc: SbDoc | any): PtBlock[] {
  if (!doc || doc.type !== 'doc' || !Array.isArray(doc.content)) {
    return []
  }
  return flattenNodes(doc.content)
}

function flattenNodes(nodes: SbNode[]): PtBlock[] {
  const result: PtBlock[] = []
  for (const node of nodes) {
    if (!node) continue
    const flattened = convertNode(node)
    if (flattened) {
      if (Array.isArray(flattened)) {
        result.push(...flattened)
      } else {
        result.push(flattened)
      }
    }
  }
  return result
}

function convertNode(node: SbNode): PtBlock | PtBlock[] | null {
  switch (node.type) {
    case 'paragraph':
      return buildBlock('normal', node.content ?? [])

    case 'heading': {
      const level = node.attrs?.level ?? 2
      return buildBlock(`h${Math.min(Math.max(level, 1), 6)}`, node.content ?? [])
    }

    case 'blockquote': {
      // Storyblok wraps blockquote content in paragraph(s). PT puts the inline content directly on the block.
      const inline = node.content?.flatMap((p) => p.content ?? []) ?? []
      return buildBlock('blockquote', inline)
    }

    case 'bullet_list':
    case 'ordered_list': {
      // Each list_item contains paragraph(s). Each paragraph becomes a PT block with listItem set.
      const listItem = node.type === 'bullet_list' ? 'bullet' : 'number'
      const items: PtBlock[] = []
      for (const item of node.content ?? []) {
        if (item.type !== 'list_item') continue
        for (const para of item.content ?? []) {
          const block = buildBlock('normal', para.content ?? [])
          block.listItem = listItem
          block.level = 1
          items.push(block)
        }
      }
      return items
    }

    case 'code_block':
      return buildBlock('normal', node.content ?? [], 'code')

    case 'blok': {
      // Embedded component. Each blok node has attrs.body = [{ component, ...fields }]
      const bloks = node.attrs?.body ?? []
      const out: PtBlock[] = []
      for (const blok of bloks) {
        const converted = bokToPortableText(blok)
        if (converted) out.push(converted)
      }
      return out
    }

    case 'image': {
      // Inline image — convert to captionedImage
      const src = node.attrs?.src ?? ''
      const alt = node.attrs?.alt ?? ''
      return {
        _type: 'captionedImage',
        _key: makeKey(),
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: '', url: src },
        },
        alt,
        caption: node.attrs?.title ?? '',
      } as any
    }

    case 'hard_break':
      // Standalone hard_break (rare at top level) — emit empty paragraph
      return buildBlock('normal', [])

    default:
      return null
  }
}

/**
 * Convert a single inline blok (e.g. { component: 'customer_quote', ... })
 * to a custom Portable Text block type that PortableTextRenderer.tsx already knows.
 */
function bokToPortableText(blok: any): PtBlock | null {
  if (!blok || !blok.component) return null
  switch (blok.component) {
    case 'customer_quote':
      return {
        _type: 'customerQuote',
        _key: makeKey(),
        quote: blok.quote ?? '',
        attributionName: blok.attribution_name ?? '',
        attributionRole: blok.attribution_role ?? '',
      } as any

    case 'callout':
      return {
        _type: 'callout',
        _key: makeKey(),
        calloutType: blok.callout_type ?? 'info',
        title: blok.title ?? '',
        body: blok.body
          ? storyblokRichtextToPortableText(blok.body)
          : [],
      } as any

    case 'captioned_image':
      return {
        _type: 'captionedImage',
        _key: makeKey(),
        image: blok.image
          ? {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: '',
                url: blok.image.filename ?? '',
              },
            }
          : null,
        alt: blok.alt ?? '',
        caption: blok.caption ?? '',
        credit: blok.credit ?? '',
        width: blok.width ?? 'default',
      } as any

    case 'video_embed':
      return {
        _type: 'videoEmbed',
        _key: makeKey(),
        url: blok.url ?? '',
        caption: blok.caption ?? '',
      } as any

    case 'stat':
      return {
        _type: 'stat',
        _key: makeKey(),
        value: blok.value ?? '',
        label: blok.label ?? '',
      } as any

    case 'data_table': {
      const rows = (blok.rows ?? []).map((r: any) => ({
        _type: 'dataTableRow',
        _key: makeKey(),
        cells: typeof r.cells === 'string' ? r.cells.split('|').map((c: string) => c.trim()) : [],
      }))
      return {
        _type: 'dataTable',
        _key: makeKey(),
        caption: blok.caption ?? '',
        hasHeaderRow: blok.has_header_row ?? true,
        rows,
      } as any
    }

    default:
      // Unknown component — skip silently to keep render robust
      return null
  }
}

/**
 * Build a standard PT block (paragraph/heading/blockquote) from inline content.
 */
function buildBlock(style: string, inline: SbInline[], codeStyle?: 'code'): PtBlock {
  const blockKey = makeKey()
  const children: PtSpan[] = []
  const markDefs: PtMarkDef[] = []
  let markDefCounter = 0

  for (const node of inline) {
    if (!node) continue

    // Hard break inside inline content becomes a newline span
    if (node.type === 'hard_break') {
      children.push({
        _type: 'span',
        _key: makeKey(),
        text: '\n',
        marks: [],
      })
      continue
    }

    if (node.type !== 'text' || !node.text) continue

    const marks: string[] = []
    for (const mark of node.marks ?? []) {
      switch (mark.type) {
        case 'bold':
          marks.push('strong')
          break
        case 'italic':
          marks.push('em')
          break
        case 'underline':
          marks.push('underline')
          break
        case 'strike':
        case 'strike-through':
          marks.push('strike-through')
          break
        case 'code':
          marks.push('code')
          break
        case 'link': {
          markDefCounter += 1
          const linkKey = `link-${blockKey}-${markDefCounter}`
          markDefs.push({
            _key: linkKey,
            _type: 'link',
            href: mark.attrs?.href ?? '',
          })
          marks.push(linkKey)
          break
        }
      }
    }

    if (codeStyle === 'code') marks.push('code')

    children.push({
      _type: 'span',
      _key: makeKey(),
      text: node.text,
      marks,
    })
  }

  // Empty block — PT renderer expects at least one span
  if (children.length === 0) {
    children.push({
      _type: 'span',
      _key: makeKey(),
      text: '',
      marks: [],
    })
  }

  return {
    _type: 'block',
    _key: blockKey,
    style,
    markDefs,
    children,
  }
}
