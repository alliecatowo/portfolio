# Portfolio Website with Strapi CMS

This is a dual-purpose portfolio website for both development and tattoo artistry, built with Nuxt 3 and Strapi CMS.

## Features

- **Dual Portfolio**: Switch between developer and tattoo artist portfolios
- **Content Management**: Strapi CMS for managing all content
- **Admin Interface**: Secure admin area for content management
- **Responsive Design**: Mobile-friendly interface with dark/light mode
- **SEO Optimized**: Meta tags and structured data for better search engine visibility

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TailwindCSS
- **Backend**: Strapi CMS (headless)
- **Authentication**: JWT-based auth with Pinia store
- **Deployment**: [Your deployment platform]

## Project Structure

```
portfolio/
├── components/         # Vue components
│   ├── common/         # Shared components
│   ├── dev/            # Developer portfolio components
│   └── tattoo/         # Tattoo portfolio components
├── composables/        # Vue composables
├── layouts/            # Page layouts
├── middleware/         # Nuxt middleware
├── pages/              # Application pages
│   ├── dev/            # Developer portfolio pages
│   └── tattoo/         # Tattoo portfolio pages
├── plugins/            # Nuxt plugins
├── public/             # Static assets
├── server/             # Server middleware
├── strapi-portfolio/   # Strapi CMS
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd portfolio
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install Strapi dependencies:
   ```bash
   cd strapi-portfolio
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory based on `.env.example`
   - Create a `.env` file in the `strapi-portfolio` directory based on `.env.example`

### Running the Development Server

1. Start the Strapi server:
   ```bash
   cd strapi-portfolio
   npm run develop
   ```

2. In a separate terminal, start the Nuxt server:
   ```bash
   # From the root directory
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Strapi Admin: http://localhost:1337/admin

## Strapi Content Types

The following content types are used in the Strapi CMS:

- **Projects**: Developer portfolio projects
- **Tattoo Works**: Tattoo portfolio works
- **Articles**: Blog posts for both portfolios
- **Testimonials**: Client testimonials for tattoo portfolio
- **Categories**: Categories for projects and articles
- **Tattoo Styles**: Styles for tattoo works

## Authentication

The admin section is protected with JWT authentication. To access the admin area:

1. Navigate to `/admin/login`
2. Log in with your Strapi credentials
3. Once authenticated, you'll have access to the admin dashboard

## Deployment

[Add deployment instructions based on your hosting platform]

## Contributing

[Add contribution guidelines if applicable]

## License

[Add license information]
