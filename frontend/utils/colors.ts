// Centralized color system for consistent badge/tag colors across the app

export type NuxtUIColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' | 'pink' | 'purple' | 'amber' | 'emerald' | 'cyan' | 'rose';

// Technology/Framework color mappings
const techColorMap: Record<string, NuxtUIColor> = {
  // JavaScript ecosystem
  'javascript': 'warning',
  'typescript': 'primary',
  'node.js': 'success',
  'nodejs': 'success',
  'express': 'neutral',
  'deno': 'info',
  'bun': 'purple',
  
  // Frontend frameworks
  'vue': 'success',
  'vue.js': 'success',
  'nuxt': 'success',
  'nuxt.js': 'success',
  'react': 'info',
  'react.js': 'info',
  'next.js': 'neutral',
  'angular': 'error',
  'svelte': 'warning',
  'astro': 'purple',
  
  // CSS & Styling
  'css': 'info',
  'sass': 'pink',
  'scss': 'pink',
  'tailwind': 'cyan',
  'tailwindcss': 'cyan',
  'bootstrap': 'purple',
  'styled-components': 'pink',
  
  // Backend & Databases
  'python': 'info',
  'django': 'success',
  'flask': 'neutral',
  'php': 'secondary',
  'laravel': 'error',
  'ruby': 'error',
  'rails': 'error',
  'go': 'cyan',
  'rust': 'warning',
  'java': 'error',
  'spring': 'success',
  
  // Databases
  'mysql': 'info',
  'postgresql': 'primary',
  'mongodb': 'success',
  'redis': 'error',
  'sqlite': 'neutral',
  'firebase': 'warning',
  'supabase': 'success',
  
  // Cloud & DevOps
  'aws': 'warning',
  'azure': 'info',
  'gcp': 'primary',
  'docker': 'info',
  'kubernetes': 'primary',
  'vercel': 'neutral',
  'netlify': 'cyan',
  'heroku': 'purple',
  
  // Tools & Others
  'git': 'warning',
  'github': 'neutral',
  'gitlab': 'warning',
  'webpack': 'info',
  'vite': 'purple',
  'rollup': 'error',
  'graphql': 'pink',
  'rest': 'success',
  'api': 'primary',
  
  // Mobile
  'react native': 'info',
  'flutter': 'info',
  'swift': 'warning',
  'kotlin': 'purple',
  'ios': 'neutral',
  'android': 'success',
};

// Blog tag color mappings
const tagColorMap: Record<string, NuxtUIColor> = {
  // Content types
  'tutorial': 'primary',
  'guide': 'primary',
  'tips': 'success',
  'tricks': 'success',
  'best practices': 'info',
  'opinion': 'purple',
  'news': 'neutral',
  'announcement': 'warning',
  'update': 'warning',
  
  // Topics
  'web': 'info',
  'mobile': 'cyan',
  'frontend': 'primary',
  'backend': 'secondary',
  'fullstack': 'success',
  'design': 'purple',
  'ux': 'pink',
  'ui': 'pink',
  'development': 'neutral',
  'programming': 'primary',
  'coding': 'primary',
  'architecture': 'secondary',
  'performance': 'warning',
  'security': 'error',
  'testing': 'success',
  'debugging': 'info',
  'deployment': 'cyan',
  'devops': 'secondary',
  'database': 'primary',
  'api': 'success',
  'opensource': 'emerald',
  'career': 'purple',
  'productivity': 'amber',
};

// Tattoo style color mappings
const tattooStyleColorMap: Record<string, NuxtUIColor> = {
  // Main styles
  'fine line': 'pink',
  'fineline': 'pink',
  'watercolor': 'purple',
  'botanical': 'emerald',
  'custom': 'primary',
  'traditional': 'error',
  'neo-traditional': 'warning',
  'realism': 'neutral',
  'blackwork': 'neutral',
  'geometric': 'cyan',
  'minimalist': 'info',
  'abstract': 'purple',
  'dotwork': 'secondary',
  'linework': 'pink',
  
  // Themes
  'floral': 'rose',
  'nature': 'emerald',
  'animals': 'amber',
  'portrait': 'neutral',
  'mandala': 'purple',
  'tribal': 'warning',
  'japanese': 'error',
  'lettering': 'primary',
  'script': 'primary',
  'ornamental': 'pink',
  'surreal': 'purple',
  'illustrative': 'info',
  'sketch': 'neutral',
  'vintage': 'amber',
  'modern': 'cyan',
};

// Project category color mappings
const projectCategoryColorMap: Record<string, NuxtUIColor> = {
  'web app': 'primary',
  'mobile app': 'cyan',
  'website': 'info',
  'api': 'success',
  'library': 'purple',
  'tool': 'warning',
  'plugin': 'secondary',
  'theme': 'pink',
  'game': 'error',
  'bot': 'neutral',
  'cli': 'emerald',
  'desktop': 'amber',
  'extension': 'purple',
  'ecommerce': 'success',
  'saas': 'primary',
  'portfolio': 'pink',
  'blog': 'info',
  'cms': 'secondary',
  'dashboard': 'cyan',
  'landing page': 'purple',
};

/**
 * Get color for a technology/framework
 */
export function getTechColor(tech: string): NuxtUIColor {
  const normalized = tech.toLowerCase().trim();
  return techColorMap[normalized] || 'neutral';
}

/**
 * Get color for a blog tag
 */
export function getTagColor(tag: string): NuxtUIColor {
  const normalized = tag.toLowerCase().trim();
  return tagColorMap[normalized] || 'neutral';
}

/**
 * Get color for a tattoo style
 */
export function getTattooStyleColor(style: string): NuxtUIColor {
  const normalized = style.toLowerCase().trim();
  return tattooStyleColorMap[normalized] || 'neutral';
}

/**
 * Get color for a project category
 */
export function getProjectCategoryColor(category: string): NuxtUIColor {
  const normalized = category.toLowerCase().trim();
  return projectCategoryColorMap[normalized] || 'neutral';
}

/**
 * Get color for any type of label (attempts all mappings)
 */
export function getColor(label: string, type?: 'tech' | 'tag' | 'style' | 'project'): NuxtUIColor {
  const normalized = label.toLowerCase().trim();
  
  if (type === 'tech') return getTechColor(normalized);
  if (type === 'tag') return getTagColor(normalized);
  if (type === 'style') return getTattooStyleColor(normalized);
  if (type === 'project') return getProjectCategoryColor(normalized);
  
  // Try all mappings if no type specified
  return techColorMap[normalized] || 
         tagColorMap[normalized] || 
         tattooStyleColorMap[normalized] || 
         projectCategoryColorMap[normalized] || 
         'neutral';
}

/**
 * Get a diverse set of colors for a list of items
 * Ensures visual variety by cycling through different color options
 */
export function getDiverseColors(items: string[], type?: 'tech' | 'tag' | 'style' | 'project'): NuxtUIColor[] {
  const colorRotation: NuxtUIColor[] = ['primary', 'success', 'info', 'warning', 'purple', 'pink', 'cyan', 'emerald', 'amber', 'rose'];
  const usedColors = new Set<NuxtUIColor>();
  
  return items.map((item, index) => {
    const baseColor = getColor(item, type);
    
    // If we got a specific color and haven't used it much, use it
    if (baseColor !== 'neutral' && !usedColors.has(baseColor)) {
      usedColors.add(baseColor);
      return baseColor;
    }
    
    // Otherwise, rotate through diverse colors
    const rotationColor = colorRotation[index % colorRotation.length];
    usedColors.add(rotationColor);
    return rotationColor;
  });
}