import Fuse from 'fuse.js'

import type {CaseStudy} from './types'

export interface FilterState {
  query: string
}

export function emptyFilters(): FilterState {
  return {query: ''}
}

const FUSE_OPTIONS = {
  keys: [
    {name: 'title', weight: 2},
    {name: 'companyName', weight: 2},
    {name: 'excerpt', weight: 1},
    {name: 'taxonomy.industries', weight: 0.5},
    {name: 'taxonomy.useCases', weight: 0.5},
  ],
  threshold: 0.35,
  ignoreLocation: true,
}

export function filterCaseStudies(caseStudies: CaseStudy[], filters: FilterState): CaseStudy[] {
  if (!filters.query.trim()) return caseStudies

  const fuse = new Fuse(caseStudies, FUSE_OPTIONS)
  return fuse.search(filters.query.trim()).map((result) => result.item)
}
