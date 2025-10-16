<template>
  <UPage>
    <UMain class="min-h-screen bg-gradient-animated bg-dots flex items-center justify-center relative overflow-hidden">
      <!-- Decorative background - hidden from screen readers -->
      <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse pulse-glow" />
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse float-animation" style="animation-delay: 2s;" />
        <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl float-animation" style="animation-delay: 4s;" />
        <div class="absolute bottom-1/3 right-1/3 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl sparkle-element" style="animation-delay: 1s;" />
      </div>

      <section class="container max-w-5xl px-6 py-20 relative z-20" aria-labelledby="page-title">
        <header class="text-center mb-16 relative z-30">
          <h1 id="page-title" class="text-5xl md:text-6xl font-bold mb-6 text-gradient-animated relative z-40" style="isolation: isolate;">
            {{ home.hero?.title }}
          </h1>
          <p v-if="home.hero?.subtitle" class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
            {{ home.hero.subtitle }}
          </p>
          <aside v-if="heroNoteKeys.length" class="mt-8 text-sm text-muted" role="note" aria-label="Keyboard shortcut">
            <span class="inline-flex items-center gap-2">
              <span v-if="home.hero?.note?.label">{{ home.hero.note.label }}</span>
              <kbd
                v-for="(key, index) in heroNoteKeys"
                :key="`${key}-${index}`"
                class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
              >
                {{ key }}
              </kbd>
              <span v-if="home.hero?.note?.suffix">{{ home.hero.note.suffix }}</span>
            </span>
          </aside>
        </header>

        <!-- Enhanced Developer Showcase -->
        <section class="max-w-4xl mx-auto" aria-labelledby="showcase-title">
          <h2 id="showcase-title" class="sr-only">Developer Showcase</h2>

          <!-- Main Developer Card -->
          <UCard class="glass-accent mb-12">
            <template #header>
              <div class="aspect-[16/9] md:aspect-[21/9] bg-gradient-dev relative overflow-hidden rounded-lg">
                <NuxtImg
                  :src="home.showcase?.image"
                  alt="Abstract representation of code and development work"
                  loading="lazy"
                  preset="hero"
                  sizes="100vw lg:1200px"
                  class="object-cover w-full h-full mix-blend-overlay opacity-60"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                  <div class="w-full">
                    <h3 v-if="home.showcase?.title" id="main-dev-title" class="text-3xl md:text-4xl font-bold text-white mb-4">
                      {{ home.showcase.title }}
                    </h3>
                    <p v-if="home.showcase?.description" class="text-white/90 text-lg md:text-xl max-w-2xl">
                      {{ home.showcase.description }}
                    </p>
                  </div>
                </div>
                <div class="absolute top-6 right-6 flex gap-3" aria-hidden="true">
                  <div
                    v-for="(highlight, index) in home.showcase?.iconHighlights || []"
                    :key="`${highlight.icon}-${index}`"
                    class="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center float-animation shadow-lg"
                    :style="highlight.delay ? { animationDelay: highlight.delay } : undefined"
                  >
                    <UIcon :name="highlight.icon" class="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
            </template>

            <p v-if="home.showcase?.summary" id="main-dev-description" class="text-default text-lg mb-8">
              {{ home.showcase.summary }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div v-for="(specialization, specializationIndex) in home.showcase?.specializations || []" :key="`specialization-${specializationIndex}`">
                <h4 v-if="specialization.title" class="font-semibold text-default mb-3">{{ specialization.title }}</h4>
                <ul class="flex flex-wrap gap-2">
                  <li
                    v-for="(item, itemIndex) in specialization.items || []"
                    :key="`specialization-${specializationIndex}-item-${itemIndex}`"
                  >
                    <UBadge :color="getBadgeColor(item)" variant="soft">
                      {{ getBadgeLabel(item) }}
                    </UBadge>
                  </li>
                </ul>
              </div>
            </div>

            <template #footer>
              <div class="flex flex-col sm:flex-row gap-4">
                <UButton
                  v-if="home.showcase?.primaryCta"
                  :to="home.showcase.primaryCta.to"
                  color="primary"
                  :variant="home.showcase.primaryCta.variant || 'magnet'"
                  size="lg"
                  block
                  class="flex-1"
                  :trailing-icon="home.showcase.primaryCta.trailingIcon"
                  :leading-icon="home.showcase.primaryCta.leadingIcon"
                >
                  {{ home.showcase.primaryCta.label }}
                </UButton>
                <UButton
                  v-if="home.showcase?.secondaryCta"
                  :to="home.showcase.secondaryCta.to"
                  color="primary"
                  :variant="home.showcase.secondaryCta.variant || 'outline'"
                  size="lg"
                  block
                  class="flex-1"
                  :trailing-icon="home.showcase.secondaryCta.trailingIcon"
                  :leading-icon="home.showcase.secondaryCta.leadingIcon"
                >
                  {{ home.showcase.secondaryCta.label }}
                </UButton>
              </div>
            </template>
          </UCard>

          <!-- Quick Links Grid -->
          <nav class="grid grid-cols-1 md:grid-cols-3 gap-6" role="navigation" aria-label="Quick navigation">
            <UCard
              v-for="(link, index) in home.quickLinks || []"
              :key="`quick-link-${index}`"
              class="glass-accent hover:scale-105 transition-transform"
              :to="link.to"
            >
              <div class="flex items-center gap-4 mb-3">
                <UIcon v-if="link.icon" :name="link.icon" class="w-5 h-5 text-primary" />
                <h3 class="font-semibold text-default">{{ link.title }}</h3>
              </div>
              <p class="text-muted text-sm">{{ link.description }}</p>
            </UCard>
          </nav>
        </section>

        <!-- Featured Projects Section -->
        <section id="projects" class="max-w-6xl mx-auto mt-24" aria-labelledby="projects-title">
          <div class="mb-16 text-center">
            <h2 id="projects-title" class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
              {{ home.projectsSection?.title }}
            </h2>
            <p v-if="home.projectsSection?.description" class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
              {{ home.projectsSection.description }}
            </p>
          </div>

          <UCarousel
            v-if="featuredProjects && featuredProjects.length > 0"
            :items="featuredProjects"
            :ui="{
              item: 'basis-full md:basis-1/2 lg:basis-1/3',
              container: 'gap-8',
              wrapper: 'mx-auto'
            }"
            arrows
            :prev="{ icon: 'i-lucide-chevron-left', size: 'sm', variant: 'outline' }"
            :next="{ icon: 'i-lucide-chevron-right', size: 'sm', variant: 'outline' }"
          >
            <template #default="{ item: project, index }">
              <UCard
                class="glass-accent hover:scale-105 transition-transform group"
                :to="`/projects/${project.slug || project.path?.split('/').pop()}`"
              >
                <template #header>
                  <div class="aspect-video bg-gradient-dev relative overflow-hidden rounded-lg">
                    <NuxtImg
                      preset="card"
                      :src="project.image || `https://picsum.photos/400/300?random=${index + 20}`"
                      :alt="project.title"
                      class="object-cover w-full h-full mix-blend-overlay opacity-70 group-hover:opacity-90 transition-opacity"
                      loading="lazy"
                      sizes="sm:100vw md:50vw lg:33vw"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <UIcon name="i-lucide-external-link" class="w-5 h-5 text-white" />
                    </div>
                  </div>
                </template>

                <h3 class="text-xl font-bold mb-3 text-default">
                  {{ project.title }}
                </h3>
                <p class="text-muted mb-4 line-clamp-2">
                  {{ project.description }}
                </p>

                <template #footer>
                  <div class="flex flex-wrap gap-2">
                    <UBadge
                      v-for="(tech, techIndex) in project.technologies?.slice(0, 3)"
                      :key="techIndex"
                      color="primary"
                      variant="soft"
                      size="sm"
                    >
                      {{ tech }}
                    </UBadge>
                  </div>
                </template>
              </UCard>
            </template>
          </UCarousel>

          <div v-else class="py-12 text-center">
            <UIcon name="i-lucide-folder" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" aria-hidden="true" />
            <p class="text-muted text-lg">Featured projects coming soon...</p>
          </div>

          <div v-if="home.projectsSection?.ctaLabel" class="mt-12 text-center">
            <UButton
              to="/projects"
              color="primary"
              variant="magnet"
              size="lg"
              trailing-icon="i-lucide-arrow-right"
            >
              {{ home.projectsSection.ctaLabel }}
            </UButton>
          </div>
        </section>

        <!-- Skills Section -->
        <UCard class="max-w-6xl mx-auto mt-24 glass-accent" aria-labelledby="skills-title">
          <div class="mb-16 text-center">
            <h2 id="skills-title" class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
              {{ home.skillsSection?.title }}
            </h2>
            <p v-if="home.skillsSection?.description" class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
              {{ home.skillsSection.description }}
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div v-for="(skill, index) in home.skillsSection?.items || []" :key="`skill-${index}`" class="text-center group">
              <div class="w-20 h-20 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <UIcon v-if="skill.icon" :name="skill.icon" class="w-10 h-10 text-primary" />
              </div>
              <h3 v-if="skill.title" class="font-semibold text-default mb-2">{{ skill.title }}</h3>
              <p v-if="skill.description" class="text-sm text-muted">{{ skill.description }}</p>
            </div>
          </div>
        </UCard>

        <!-- Recent Blog Posts -->
        <section id="blog" class="max-w-6xl mx-auto mt-24" aria-labelledby="blog-title">
          <div class="mb-16 text-center">
            <h2 id="blog-title" class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
              {{ home.blogSection?.title }}
            </h2>
            <p v-if="home.blogSection?.description" class="text-xl md:text-2xl text-default max-w-3xl mx-auto">
              {{ home.blogSection.description }}
            </p>
          </div>

          <div v-if="recentPosts && recentPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <UBlogPost
              v-for="(post, index) in recentPosts"
              :key="post.slug || post.path"
              :title="post.title"
              :description="post.description"
              :date="post.date"
              :image="post.featured_image || `https://picsum.photos/400/300?random=${index + 30}`"
              :to="`/blog/${post.slug || post.path?.split('/').pop()}`"
              variant="outline"
              orientation="vertical"
              class="glass-accent hover:scale-105 transition-transform"
            />
          </div>

          <div v-else class="py-12 text-center">
            <UIcon name="i-lucide-book-open" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" aria-hidden="true" />
            <p class="text-muted text-lg">Blog posts coming soon...</p>
          </div>

          <div v-if="home.blogSection?.ctaLabel" class="mt-12 text-center">
            <UButton
              to="/blog"
              color="primary"
              variant="magnet"
              size="lg"
              trailing-icon="i-lucide-arrow-right"
            >
              {{ home.blogSection.ctaLabel }}
            </UButton>
          </div>
        </section>

        <!-- Contact CTA -->
        <aside class="max-w-4xl mx-auto mt-24 mb-16">
          <div class="glass-accent rounded-xl p-8 md:p-12 text-center hover-lift">
            <h2 v-if="home.contactSection?.title" class="text-4xl md:text-5xl font-bold mb-6 text-gradient-animated">
              {{ home.contactSection.title }}
            </h2>
            <p v-if="home.contactSection?.description" class="text-xl md:text-2xl text-default max-w-2xl mx-auto mb-8">
              {{ home.contactSection.description }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <UButton
                v-if="home.contactSection?.primaryCta"
                :to="home.contactSection.primaryCta.to"
                color="primary"
                :variant="home.contactSection.primaryCta.variant || 'magnet'"
                size="lg"
                :leading-icon="home.contactSection.primaryCta.icon"
              >
                {{ home.contactSection.primaryCta.label }}
              </UButton>
              <UButton
                v-if="home.contactSection?.secondaryCta"
                :to="home.contactSection.secondaryCta.to"
                color="primary"
                :variant="home.contactSection.secondaryCta.variant || 'outline'"
                size="lg"
                :leading-icon="home.contactSection.secondaryCta.icon"
              >
                {{ home.contactSection.secondaryCta.label }}
              </UButton>
            </div>
          </div>
        </aside>
      </section>
    </UMain>
  </UPage>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useContent } from '~/composables/useContent';

type BadgeItem = string | { label: string; color?: string };

type CallToAction = {
  label: string;
  to: string;
  variant?: string;
  leadingIcon?: string;
  trailingIcon?: string;
};

type ShowcaseSection = {
  title?: string;
  description?: string;
  summary?: string;
  image?: string;
  iconHighlights?: Array<{ icon: string; delay?: string }>;
  specializations?: Array<{ title?: string; items?: BadgeItem[] }>;
  primaryCta?: CallToAction;
  secondaryCta?: CallToAction;
};

type HomeContent = {
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  hero?: {
    title?: string;
    subtitle?: string;
    note?: {
      label?: string;
      suffix?: string;
      keys?: string[];
    };
  };
  showcase?: ShowcaseSection;
  quickLinks?: Array<{
    title: string;
    description: string;
    to: string;
    icon?: string;
  }>;
  projectsSection?: {
    title?: string;
    description?: string;
    ctaLabel?: string;
  };
  skillsSection?: {
    title?: string;
    description?: string;
    items?: Array<{
      title?: string;
      description?: string;
      icon?: string;
    }>;
  };
  blogSection?: {
    title?: string;
    description?: string;
    ctaLabel?: string;
  };
  contactSection?: {
    title?: string;
    description?: string;
    primaryCta?: CallToAction & { icon?: string };
    secondaryCta?: CallToAction & { icon?: string };
  };
};

const fallbackHomeContent = {
  seo: {
    title: "Allison's Developer Portfolio - Full-Stack Web Development",
    description: 'Full-stack developer specializing in modern web technologies, Vue.js, Node.js, and creating exceptional user experiences.',
    keywords: ['developer', 'portfolio', 'web development', 'Vue.js', 'Node.js', 'TypeScript', 'full-stack', 'software engineer']
  },
  hero: {
    title: "Allison's Developer Portfolio",
    subtitle: 'Full-stack developer specializing in modern web technologies, creative problem solving, and building exceptional user experiences.',
    note: {
      label: 'Press',
      keys: ['⌘', 'K']
    }
  },
  showcase: {
    title: 'Crafting Digital Experiences',
    description: 'Passionate about building scalable applications, elegant user interfaces, and solving complex technical challenges.',
    summary: 'Specializing in modern web technologies with expertise in Vue.js, Node.js, and full-stack development. I love creating intuitive interfaces and robust backend systems that scale.',
    image: 'https://picsum.photos/1200/600?random=100',
    iconHighlights: [
      { icon: 'i-lucide-code' },
      { icon: 'i-lucide-monitor', delay: '0.5s' }
    ],
    specializations: [
      {
        title: 'Frontend Excellence',
        items: [
          { label: 'Vue.js', color: 'green' },
          { label: 'Nuxt', color: 'blue' },
          { label: 'TypeScript', color: 'yellow' },
          { label: 'Tailwind', color: 'cyan' }
        ]
      },
      {
        title: 'Backend & Tools',
        items: [
          { label: 'Node.js', color: 'purple' },
          { label: 'Firebase', color: 'red' },
          { label: 'Docker', color: 'gray' },
          { label: 'Git/CI', color: 'primary' }
        ]
      }
    ],
    primaryCta: {
      label: 'View My Work',
      to: '#projects',
      variant: 'magnet',
      trailingIcon: 'i-lucide-arrow-down'
    },
    secondaryCta: {
      label: 'About Me',
      to: '/about',
      variant: 'outline'
    }
  },
  quickLinks: [
    {
      title: 'Projects',
      description: 'Explore my latest work and technical projects',
      to: '#projects',
      icon: 'i-lucide-folder-code'
    },
    {
      title: 'Blog',
      description: 'Technical insights and development thoughts',
      to: '#blog',
      icon: 'i-lucide-book-open'
    },
    {
      title: 'Contact',
      description: "Let's discuss your next project",
      to: '/contact',
      icon: 'i-lucide-message-circle'
    }
  ],
  projectsSection: {
    title: 'Featured Projects',
    description: 'Innovative solutions and technical showcases',
    ctaLabel: 'View All Projects'
  },
  skillsSection: {
    title: 'Technical Skills',
    description: 'Technologies and tools I use to build exceptional experiences',
    items: [
      {
        title: 'Frontend',
        description: 'Vue, Nuxt, React, TypeScript, Tailwind',
        icon: 'i-lucide-monitor'
      },
      {
        title: 'Backend',
        description: 'Node.js, Express, PostgreSQL, MongoDB',
        icon: 'i-lucide-server'
      },
      {
        title: 'Cloud & DevOps',
        description: 'Firebase, Docker, CI/CD, Git',
        icon: 'i-lucide-cloud'
      },
      {
        title: 'Mobile & PWA',
        description: 'React Native, Progressive Web Apps',
        icon: 'i-lucide-smartphone'
      }
    ]
  },
  blogSection: {
    title: 'Latest Insights',
    description: 'Thoughts on development, technology, and innovation',
    ctaLabel: 'View All Articles'
  },
  contactSection: {
    title: "Let's Build Something Amazing",
    description: "Ready to bring your ideas to life? Let's discuss your next project.",
    primaryCta: {
      label: 'Get In Touch',
      to: '/contact',
      variant: 'magnet',
      leadingIcon: 'i-lucide-mail'
    },
    secondaryCta: {
      label: 'Learn More About Me',
      to: '/about',
      variant: 'outline'
    }
  }
} as HomeContent;

const { data: homeContent } = await useAsyncData<HomeContent | null>(
  'home-content',
  async () => {
    const result = await queryCollection('home').first();
    return (result as HomeContent | null) ?? null;
  }
);

const home = computed<HomeContent>(() => homeContent.value ?? fallbackHomeContent);

const heroNoteKeys = computed(() => home.value.hero?.note?.keys ?? []);

function getBadgeLabel(item: BadgeItem) {
  return typeof item === 'string' ? item : item.label;
}

function getBadgeColor(item: BadgeItem) {
  return typeof item === 'string' ? 'primary' : item.color || 'primary';
}

useHead(() => {
  const seo = home.value.seo || fallbackHomeContent.seo;
  const meta: Array<{ name?: string; property?: string; content: string }> = [];

  if (seo?.description) {
    meta.push({ name: 'description', content: seo.description });
    meta.push({ property: 'og:description', content: seo.description });
  }

  if (seo?.keywords?.length) {
    meta.push({ name: 'keywords', content: seo.keywords.join(', ') });
  }

  if (seo?.title) {
    meta.push({ property: 'og:title', content: seo.title });
  }

  return {
    title: seo?.title,
    meta
  };
});

// Use content composable to fetch featured content
const { fetchProjects, fetchBlogPosts } = useContent();

// Fetch featured projects and recent blog posts
const { data: featuredProjects } = await useAsyncData(
  'home-featured-projects',
  () => fetchProjects(3, true)
);

const { data: recentPosts } = await useAsyncData(
  'home-recent-posts',
  () => fetchBlogPosts(3)
);
</script>
