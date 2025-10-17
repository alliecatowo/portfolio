export interface FooterSocialLink {
  label: string
  url: string
  icon: string
  tooltip?: string
  srLabel?: string
}

export interface FooterQuickLink {
  label: string
  to: string
}

export interface FooterContactDetails {
  message?: string
  email?: string
}

export interface FooterContent {
  title: string
  tagline: string
  socials: FooterSocialLink[]
  quickLinks: FooterQuickLink[]
  contact?: FooterContactDetails
  builtWith?: string
  copyrightName: string
}

export type FooterSettingsEntry = FooterContent & {
  id: string
  [key: string]: unknown
}
