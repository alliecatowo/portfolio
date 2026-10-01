/**
 * Theme groups for /projects, in display order. A project's `group`
 * frontmatter field holds one of these keys. Missing or unknown groups fall
 * into OTHER_GROUP so a typo can't silently drop a card.
 */
export const PROJECT_GROUPS = [
  { key: 'browser-agents', label: 'Browser agents & WebMCP', short: 'WebMCP' },
  { key: 'agent-systems-devtools', label: 'Agent systems & developer tools', short: 'Agents & devtools' },
  { key: 'languages-runtimes', label: 'Languages & runtimes', short: 'Languages' },
  { key: 'social-systems', label: 'Social systems', short: 'Social' },
  { key: 'hardware-homelab', label: 'Hardware & homelab', short: 'Hardware' },
  { key: 'earlier-work', label: 'Earlier work', short: 'Earlier' }
] as const

export const OTHER_GROUP = { key: 'other', label: 'Other projects', short: 'Other' } as const

export type ProjectGroup = { key: string, label: string, short: string }

const groupByKey = new Map<string, ProjectGroup>(PROJECT_GROUPS.map(g => [g.key, g]))

export function projectGroupOf(key?: string | null): ProjectGroup {
  return (key && groupByKey.get(key)) || OTHER_GROUP
}

export function projectGroupIndex(key?: string | null): number {
  const index = PROJECT_GROUPS.findIndex(g => g.key === key)
  return index === -1 ? PROJECT_GROUPS.length : index
}
