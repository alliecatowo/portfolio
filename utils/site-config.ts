interface SiteConfig {
  domain?: string;
  title: string;
  description: string;
  type: 'dev' | 'tattoo';
  themeClass: string;
  baseRoute?: string;
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

export function getSiteConfig(siteType: 'dev' | 'tattoo'): SiteConfig {
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
  const config = useState<SiteConfig>('site-config', () => getSiteConfig('dev'));
  return config;
} 