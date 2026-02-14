/** Generate URL-friendly slug from text */
export function slugify(text) {
  if (!text || typeof text !== 'string') return ''
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/** Get property URL slug - prefers property.slug, else slugify(title), else id */
export function getPropertySlug(property) {
  if (!property) return ''
  if (property.slug) return property.slug
  if (property.title) return slugify(property.title)
  return String(property.id ?? '')
}
