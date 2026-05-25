import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

const LANGUAGES = new Set(['en', 'es', 'fr'])

/**
 * Public URLs use `/case-studies/{slug}`; Storyblok preview uses `/case-studies/{lang}/{slug}`.
 * Next.js cannot host `[slug]` and `[lang]` as sibling dynamic segments, so we redirect here.
 */
export function middleware(request: NextRequest) {
  const {pathname, search} = request.nextUrl
  const match = pathname.match(/^\/case-studies\/([^/]+)$/)
  if (!match) return NextResponse.next()

  const segment = match[1]
  if (LANGUAGES.has(segment)) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/case-studies/en/${segment}`
  url.search = search
  return NextResponse.redirect(url)
}

export const config = {
  matcher: '/case-studies/:segment',
}
