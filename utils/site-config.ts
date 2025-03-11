interface SiteConfig {
  domain: string;
  title: string;
  description: string;
  type: 'dev' | 'tattoo';
  themeClass: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    email?: string;
  };
}

export const DEV_DOMAIN = 'allisons.dev';
export const TATTOO_DOMAIN = 'allisons.gay';

export function getSiteConfig(hostname: string): SiteConfig {
  const isDev = hostname.includes(DEV_DOMAIN);
  const isTattoo = hostname.includes(TATTOO_DOMAIN);
  
  // Default to developer site in local development
  const siteType = isTattoo ? 'tattoo' : 'dev';
  
  const configs: Record<'dev' | 'tattoo', SiteConfig> = {
    dev: {
      domain: DEV_DOMAIN,
      title: "Allison's Developer Portfolio",
      description: "Full-stack developer specializing in modern web technologies",
      type: 'dev',
      themeClass: 'theme-dev',
      socialLinks: {
        github: 'https://github.com/allison',
        linkedin: 'https://linkedin.com/in/allison',
        twitter: 'https://twitter.com/allison',
        email: 'dev@allisons.dev',
      }
    },
    tattoo: {
      domain: TATTOO_DOMAIN,
      title: "Allison's Tattoo Art",
      description: "Unique and creative tattoo designs with a personal touch",
      type: 'tattoo',
      themeClass: 'theme-tattoo',
      socialLinks: {
        instagram: 'https://instagram.com/allison.tattoo',
        twitter: 'https://twitter.com/allison.tattoo',
        email: 'ink@allisons.gay',
      }
    }
  };
  
  return configs[siteType];
}

export function useSiteConfig() {
  const config = useState<SiteConfig>('site-config');
  return config;
} 