export interface SiteConfig {
  domain?: string;
  title: string;
  description: string;
  type: 'dev' | 'dual';
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

export function getSiteConfig(siteType: 'dev' | 'dual'): SiteConfig {
  const configs: Record<'dev' | 'dual', SiteConfig> = {
    dev: {
      domain: DEV_DOMAIN,
      title: "Allison's Developer Portfolio",
      description: "Full-stack developer specializing in modern web technologies",
      type: 'dev',
      themeClass: 'theme-dev',
      socialLinks: {
        github: 'https://github.com/alliecatowo',
        linkedin: 'https://linkedin.com/in/allison',
        twitter: 'https://twitter.com/allison',
        email: 'dev@allisons.dev',
      }
    },
    dual: {
      domain: DEV_DOMAIN,
      title: "Allison's Developer Portfolio",
      description: "Full-stack developer specializing in modern web technologies and creative problem solving",
      type: 'dual',
      themeClass: 'theme-dual',
      socialLinks: {
        github: 'https://github.com/alliecatowo',
        linkedin: 'https://linkedin.com/in/allison',
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
