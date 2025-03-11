# Portfolio Website Development Progress

## Current Status

We've restructured the portfolio website to properly support toggling between developer and tattoo portfolio modes. Instead of using multiple domains, we now use a route-based approach with `/dev` and `/tattoo` as the base routes for each portfolio type.

### Completed Tasks

- Created route-based navigation system with `/dev` and `/tattoo` routes
- Implemented site-config middleware that sets the site type based on the current route
- Created separate index pages for developer and tattoo portfolios
- Added a landing page that lets users choose which portfolio to view
- Added navigation toggle button in header to switch between portfolios
- Added redirection middleware to handle old routes
- Implemented Strapi API integration
  - Created utility functions for fetching data from Strapi
  - Added content type-specific API functions
  - Added response formatting helpers

### Current Structure

The website now follows this structure:
- `/` - Landing page with portfolio choice
- `/dev` - Developer portfolio
- `/tattoo` - Tattoo artist portfolio
- Each portfolio has its own navigation and content

### Next Steps

1. **Content Integration**: Connect the frontend components to Strapi CMS data
2. **Component Refinement**: Ensure all components properly display content from CMS
3. **Route Organization**: Move existing page routes to their respective folders
4. **Testing**: Test the site type switching and data fetching
5. **Deployment**: Set up deployment once content integration is complete

## Technical Details

- Using Nuxt.js 3 with Vue 3 Composition API
- Tailwind CSS for styling
- Strapi for content management
- Route-based site type determination
- Shared components with conditional rendering based on site type 