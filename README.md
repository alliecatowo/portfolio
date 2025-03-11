# Allison's Dual Portfolio Website

A Nuxt.js 3 website that showcases both developer and tattoo artist portfolios in one codebase.

## Features

- Dual portfolio functionality
- Route-based portfolio selection (`/dev` and `/tattoo` routes)
- Strapi CMS integration
- Responsive design with Tailwind CSS
- Dark/light mode toggle
- Blog functionality
- Project/gallery showcase

## Project Structure

```
├── assets/           # Static assets (CSS, images)
├── components/       # Vue components
│   ├── common/       # Shared components
│   ├── dev/          # Developer portfolio components
│   └── tattoo/       # Tattoo portfolio components
├── composables/      # Vue composables
├── docs/             # Documentation
├── layouts/          # Page layouts
├── middleware/       # Nuxt middleware
├── pages/            # Page components
│   ├── dev/          # Developer portfolio pages
│   ├── tattoo/       # Tattoo portfolio pages
│   └── index.vue     # Landing page with portfolio choice
├── plugins/          # Nuxt plugins
├── public/           # Public static files
├── server/           # Server-side code
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
    └── api/          # API utilities for Strapi
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- Strapi CMS (see docs/strapi-setup.md)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd portfolio
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the environment variables in `.env`:
   ```
   STRAPI_URL=http://localhost:1337
   STRAPI_TOKEN=your_api_token_here
   ```

### Development

Start the development server:

```
npm run dev
```

The site will be available at:
- http://localhost:3000 - Landing page
- http://localhost:3000/dev - Developer portfolio
- http://localhost:3000/tattoo - Tattoo portfolio

### Build for Production

```
npm run build
```

### Preview Production Build

```
npm run preview
```

## Portfolio Navigation

The website has two distinct portfolios:

1. **Developer Portfolio** (`/dev`)
   - Projects showcase
   - Open source contributions
   - Technical blog posts

2. **Tattoo Artist Portfolio** (`/tattoo`)
   - Tattoo gallery
   - Client testimonials
   - Tattoo-related blog posts

Users can switch between portfolios using the toggle in the header.

## Content Management

Content is managed through a Strapi CMS. See `docs/strapi-setup.md` for setup instructions and content type definitions.

## Deployment

See `docs/deployment.md` for deployment instructions.

## Testing

See `docs/testing.md` for testing information.

## License

[MIT](LICENSE)
