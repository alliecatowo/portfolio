interface SiteConfig {
  domain?: string;
  title: string;
  description: string;
  type: 'dev' | 'tattoo' | 'dual';
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

export function getSiteConfig(siteType: 'dev' | 'tattoo' | 'dual'): SiteConfig {
  const configs: Record<'dev' | 'tattoo' | 'dual', SiteConfig> = {
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
    },
    dual: {
      title: "Allison's Portfolio",
      description: "Software developer and tattoo artist portfolio",
      type: 'dual',
      themeClass: 'theme-dual',
      socialLinks: {
        email: 'hello@allisons.dev',
      }
    }
  };
  
  return configs[siteType];
}

export function useSiteConfig() {
  // Use the siteConfig state that's set in the middleware
  const config = useState<SiteConfig>('siteConfig', () => getSiteConfig('dual'));
  return config;
} 