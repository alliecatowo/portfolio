// Centralized color system for consistent badge/tag colors across the app

export type NuxtUIColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';

// Technology/Framework color mappings
const techColorMap: Record<string, NuxtUIColor> = {
  // JavaScript ecosystem
  'javascript': 'warning',
  'typescript': 'primary',
  'node.js': 'success',
  'nodejs': 'success',
  'express': 'neutral',
  'deno': 'info',
  'bun': 'secondary',
  
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
  'astro': 'secondary',
  
  // CSS & Styling
  'css': 'info',
  'sass': 'secondary',
  'scss': 'secondary',
  'tailwind': 'info',
  'tailwindcss': 'info',
  'bootstrap': 'secondary',
  'styled-components': 'secondary',
  
  // Backend & Databases
  'python': 'info',
  'django': 'success',
  'flask': 'neutral',
  'php': 'secondary',
  'laravel': 'error',
  'ruby': 'error',
  'rails': 'error',
  'go': 'info',
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
  'netlify': 'info',
  'heroku': 'secondary',
  
  // Tools & Others
  'git': 'warning',
  'github': 'neutral',
  'gitlab': 'warning',
  'webpack': 'info',
  'vite': 'secondary',
  'rollup': 'error',
  'graphql': 'secondary',
  'rest': 'success',
  'api': 'primary',
  
  // Mobile
  'react native': 'info',
  'flutter': 'info',
  'swift': 'warning',
  'kotlin': 'secondary',
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
  'opinion': 'secondary',
  'news': 'neutral',
  'announcement': 'warning',
  'update': 'warning',
  
  // Topics
  'web': 'info',
  'mobile': 'info',
  'frontend': 'primary',
  'backend': 'secondary',
  'fullstack': 'success',
  'design': 'secondary',
  'ux': 'secondary',
  'ui': 'secondary',
  'development': 'neutral',
  'programming': 'primary',
  'coding': 'primary',
  'architecture': 'secondary',
  'performance': 'warning',
  'security': 'error',
  'testing': 'success',
  'debugging': 'info',
  'deployment': 'info',
  'devops': 'secondary',
  'database': 'primary',
  'api': 'success',
  'opensource': 'success',
  'career': 'secondary',
  'productivity': 'warning',
};


// Project category color mappings
const projectCategoryColorMap: Record<string, NuxtUIColor> = {
  'web app': 'primary',
  'mobile app': 'info',
  'website': 'info',
  'api': 'success',
  'library': 'secondary',
  'tool': 'warning',
  'plugin': 'secondary',
  'theme': 'secondary',
  'game': 'error',
  'bot': 'neutral',
  'cli': 'success',
  'desktop': 'warning',
  'extension': 'secondary',
  'ecommerce': 'success',
  'saas': 'primary',
  'portfolio': 'secondary',
  'blog': 'info',
  'cms': 'secondary',
  'dashboard': 'info',
  'landing page': 'secondary',
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
 * Get color for a project category
 */
export function getProjectCategoryColor(category: string): NuxtUIColor {
  const normalized = category.toLowerCase().trim();
  return projectCategoryColorMap[normalized] || 'neutral';
}

/**
 * Get color for any type of label (attempts all mappings)
 */
export function getColor(label: string, type?: 'tech' | 'tag' | 'project'): NuxtUIColor {
  const normalized = label.toLowerCase().trim();
  
  if (type === 'tech') return getTechColor(normalized);
  if (type === 'tag') return getTagColor(normalized);
  if (type === 'project') return getProjectCategoryColor(normalized);
  
  // Try all mappings if no type specified
  return techColorMap[normalized] || 
         tagColorMap[normalized] || 
         projectCategoryColorMap[normalized] || 
         'neutral';
}

/**
 * Get a diverse set of colors for a list of items
 * Ensures visual variety by cycling through different color options
 */
export function getDiverseColors(items: string[], type?: 'tech' | 'tag' | 'project'): NuxtUIColor[] {
  const colorRotation: NuxtUIColor[] = ['primary', 'success', 'info', 'warning', 'secondary', 'error', 'neutral'];
  const usedColors = new Set<NuxtUIColor>();
  
  return items.map((item, index) => {
    const baseColor = getColor(item, type);
    
    // If we got a specific color and haven't used it much, use it
    if (baseColor !== 'neutral' && !usedColors.has(baseColor)) {
      usedColors.add(baseColor);
      return baseColor;
    }
    
    // Otherwise, rotate through diverse colors
    const rotationColor = colorRotation[index % colorRotation.length] || 'neutral';
    usedColors.add(rotationColor);
    return rotationColor;
  });
}