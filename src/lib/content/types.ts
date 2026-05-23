export type PortableTextBlock = {
  _type: string
  _key?: string
  [key: string]: unknown
}

export interface CaseStudy {
  slug: string
  title: string
  excerpt: string
  companyName: string
  companyLogo: {url: string; alt: string} | null
  featuredImage: {url: string; alt: string} | null
  publishedAt: string | null
  updatedAt?: string | null
  language: 'en' | 'es' | 'fr'
  taxonomy: {
    industries: string[]
    regions: string[]
    useCases: string[]
    productsUsed: string[]
    companySize: 'SMB' | 'Mid-market' | 'Enterprise'
  }
  stats: Array<{value: string; label: string}>
  customerQuote?: {
    quote: string
    attributionName: string
    attributionRole: string
  }
  body: PortableTextBlock[]
  seo: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: {url: string; alt: string}
    noindex: boolean
  }
  readingTimeMinutes: number
  translations?: {language: string; slug: string}[]
}

export interface ContentAdapter {
  getAllCaseStudies(options?: {language?: string}): Promise<CaseStudy[]>
  getCaseStudyBySlug(slug: string, options?: {language?: string}): Promise<CaseStudy | null>
  getAllSlugs(options?: {
    language?: string
    perspective?: 'published' | 'previewDrafts'
    stega?: boolean
  }): Promise<{slug: string; language: string}[]>
  getAllTaxonomyValues(): Promise<{
    industries: string[]
    regions: string[]
    useCases: string[]
    productsUsed: string[]
    companySizes: string[]
  }>
}
