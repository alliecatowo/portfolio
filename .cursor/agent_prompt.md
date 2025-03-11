# Portfolio Website Development Prompt

## Project Overview

I need you to build a dual-purpose portfolio website for me, as I am both a tattoo artist and a software developer. The website will have two main sections:

1. **Developer Portfolio** (allisons.dev)
2. **Tattoo Artist Portfolio** (allisons.gay)

Both sections will share a codebase but have different visual styles and content focus.

## Tech Stack Requirements

- **Frontend**: Nuxt.js 3 with Vue 3 Composition API
- **CMS**: Strapi for content management
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Vercel for the frontend, separate hosting for Strapi
- **Version Control**: Git with GitHub
- **Testing**: Vitest and Cypress

## Design Requirements

- **Color Scheme**: Predominantly pink, with white and baby blue accents
- **Dark Mode**: Pink and black theme for dark mode
- **Developer Site**: Professional but creative design with a focus on technical skills
- **Tattoo Site**: Artistic, visually striking design showcasing tattoo work

## Functional Requirements

### For Both Sites
- Responsive design
- Dark/light mode toggle
- Blog functionality
- Portfolio/projects section
- SEO optimization
- Fast loading and performance
- Contact form

### Developer Portfolio Features
- Open source tools directory
- GitHub integration showing activity
- LinkedIn integration
- Skills and technologies showcase
- Projects with descriptions and links
- Optional: Resume/CV section

### Tattoo Portfolio Features
- Gallery of tattoo works categorized by style
- Client testimonials
- Artist bio and journey
- Design style overview
- Future (not in v1): Scheduling integration with Setmore

## Development Workflow

1. Set up project structure and version control
2. Set up Nuxt.js frontend with TypeScript
3. Implement design system and shared components
4. Set up Strapi backend and define content types
5. Develop the developer portfolio sections
6. Develop the tattoo portfolio sections
7. Implement blog functionality for both sites
8. Add testing and refine features
9. Optimize for performance and accessibility
10. Deploy to Vercel and configure custom domains

## Guidelines for Development

- Follow a mobile-first approach for responsive design
- Use atomic Git commits with meaningful messages
- Implement proper error handling
- Write clean, documented code
- Follow Vue.js best practices and style guide
- Optimize images and assets for performance
- Ensure WCAG 2.1 AA accessibility compliance
- Implement proper SEO practices
- Use TypeScript for type safety

## Expected Output

I expect you to develop the full website, including:

1. Source code in a GitHub repository
2. Frontend deployed to Vercel
3. Strapi CMS setup with content types
4. Documentation for:
   - Setup and installation
   - Content management
   - Deployment procedures
   - Architecture overview

## My Environment

- Operating System: macOS 24.3.0
- Shell: /bin/zsh
- I already own the domains allisons.dev and allisons.gay

## Development Process

Please start by initializing the project and setting up the basic architecture. Follow these steps:

1. Initialize a Git repository and set up initial project structure
2. Set up Nuxt.js with TypeScript, Tailwind CSS, and required dependencies
3. Create design system implementing the color scheme
4. Set up basic layouts and shared components
5. Implement Strapi CMS with the necessary content types
6. Develop core functionality progressively
7. As we progress, I may need to provide credentials for services like Vercel, GitHub, or domain configuration

Throughout development, please:
- Show your progress with screenshots
- Test functionality on both mobile and desktop views
- Keep track of any issues or challenges that arise
- Provide clear explanations of your design and implementation decisions
- Ask specific questions if you need clarification or input from me

I'm looking forward to working with you to create a beautiful and functional dual portfolio website that showcases both aspects of my professional identity.

## Additional Notes

- I'd like you to guide me through any setup that requires my direct involvement
- Feel free to suggest alternatives if you identify better approaches
- Make use of the MCP tools available to automate and streamline the development process
- Keep the project well-organized for future extensibility, particularly for adding the scheduling feature later 