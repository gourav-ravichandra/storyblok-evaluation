/** Resolve Storyblok asset field → URL + alt for Next/Image or img. */
export function storyblokAsset(
  value: unknown,
  altFallback = '',
): {url: string; alt: string} | null {
  if (!value) return null
  if (typeof value === 'string') return {url: value, alt: altFallback}
  if (typeof value === 'object' && value !== null && 'filename' in value) {
    const asset = value as {filename?: string; alt?: string}
    if (asset.filename) {
      return {url: asset.filename, alt: asset.alt ?? altFallback}
    }
  }
  return null
}
