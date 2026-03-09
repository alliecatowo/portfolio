export type FooterSocial = {
  label: string
  url: string
  icon: string
  tooltip?: string
  srLabel?: string
}

export type FooterQuickLink = {
  label: string
  to: string
}

export type FooterContact = {
  message?: string
  email?: string
}

export type FooterContent = {
  title: string
  tagline: string
  socials?: FooterSocial[]
  quickLinks?: FooterQuickLink[]
  contact?: FooterContact
  builtWith?: string
  copyrightName: string
}
