# Allison's Portfolio

A dual portfolio website showcasing both developer and tattoo artist work. Built with Nuxt.js frontend and Strapi backend.

## Project Structure

This project is organized as a monorepo with two main components:

- **Frontend**: A Nuxt.js application (Node v23+)
- **Backend**: A Strapi CMS (Node v22)

## Prerequisites

- Node.js (v22 and v23 via nvm)
- npm
- Git

## Setup

1. Clone the repository:

```bash
git clone https://github.com/alliecatowo/portfolio.git
cd portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Copy example environment files
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

4. Update the environment variables in the `.env` files with your own values.

## Running the Application

### Development

To run both the frontend and backend in development mode:

```bash
npm run dev
```

This will start:
- Strapi backend at http://localhost:1337
- Nuxt frontend at http://localhost:3000

### Running Separately

To run the frontend only:

```bash
npm run dev:frontend
```

To run the backend only:

```bash
npm run dev:backend
```

## Building for Production

```bash
npm run build
```

## Deployment

### Frontend (Vercel)

The frontend can be deployed to Vercel:

```bash
cd frontend
vercel
```

### Backend (Your preferred hosting)

The Strapi backend can be deployed to various hosting platforms. See the [Strapi deployment documentation](https://docs.strapi.io/dev-docs/deployment) for more information.

## Content Management

Access the Strapi admin panel at http://localhost:1337/admin to manage content.

## License

MIT
