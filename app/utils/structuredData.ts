// Shared schema.org nodes for JSON-LD. The Person is defined once here and
// referenced by @id from projects and posts.

export const SITE_URL = 'https://allisons.dev/'
export const PERSON_ID = `${SITE_URL}#person`
export const WEBSITE_ID = `${SITE_URL}#website`

export const personSchema = () => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  'name': 'Allison Coleman',
  'url': SITE_URL,
  'image': `${SITE_URL}images/ghibli-pfp.png`,
  'jobTitle': 'Software Engineer',
  'worksFor': { '@type': 'Organization', 'name': 'Hinge Health', 'url': 'https://www.hingehealth.com/' },
  'homeLocation': { '@type': 'Place', 'name': 'Bay Area, California' },
  'sameAs': [
    'https://github.com/alliecatowo',
    'https://linkedin.com/in/allie-cat',
    'https://x.com/AllieCatOwO',
    'https://devpost.com/alliecatowo'
  ],
  'knowsAbout': [
    'Agent systems',
    'Developer tools',
    'WebMCP',
    'Programming languages',
    'Runtimes'
  ],
  'award': 'OpenAI WebMCP Challenge Winner (2026)'
})

/** Compact Person reference for `author` fields. */
export const personRef = () => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  'name': 'Allison Coleman',
  'url': SITE_URL
})

export const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  'name': 'Allison Coleman',
  'url': SITE_URL,
  'publisher': { '@id': PERSON_ID }
})

// Technologies that are programming languages (lowercased), for SoftwareSourceCode.
const LANGUAGES = new Set([
  'typescript', 'javascript', 'python', 'rust', 'go', 'c', 'c++', 'c#', 'java',
  'kotlin', 'swift', 'ruby', 'elixir', 'zig', 'lua', 'bash', 'shell', 'sql',
  'html', 'css', 'haskell', 'ocaml', 'scala', 'php', 'dart', 'nix'
])

export const programmingLanguages = (technologies: string[] = []) =>
  technologies.filter(t => LANGUAGES.has(t.toLowerCase()))

/** ISO 8601 date, or undefined when the value does not parse. */
export const toIsoDate = (value?: string | Date | null) => {
  if (!value) return undefined
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

/** Absolute https://allisons.dev URL for a site-relative path; absolute URLs pass through. */
export const absoluteSiteUrl = (path: string) =>
  /^https?:\/\//.test(path) ? path : new URL(path, SITE_URL).href
