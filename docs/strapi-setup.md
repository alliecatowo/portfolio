# Strapi CMS Setup Guide

This guide will walk you through setting up and configuring Strapi CMS for the dual-purpose portfolio website.

## Installation and Basic Setup

1. **Create a new Strapi project**:
   ```bash
   # Create a new Strapi project
   npx create-strapi-app@latest strapi-portfolio --quickstart
   ```

2. **Start the Strapi server**:
   ```bash
   cd strapi-portfolio
   npm run develop
   ```

3. **Create an admin user** when prompted in the browser.

## API Token Configuration

1. In the Strapi admin panel, navigate to **Settings** > **API Tokens**.
2. Click **Create new API Token**.
3. Fill in the following information:
   - **Name**: `Portfolio Frontend`
   - **Description**: `Token for the portfolio frontend to access content`
   - **Token duration**: Unlimited (or set as needed)
   - **Token type**: Full access
4. Click **Save** and copy the generated token.
5. Add the token to the `.env` file in the Nuxt.js project:
   ```
   STRAPI_TOKEN=your_generated_token
   ```

## Content Types Setup

Here are the content types you need to create in Strapi for the portfolio website:

### 1. Posts (Blog)

**Fields**:
- `title` (Text)
- `slug` (UID, based on title)
- `content` (Rich Text)
- `excerpt` (Text, long)
- `image` (Media, single)
- `publishedAt` (Date)
- `categories` (Relation, many-to-many with Categories)
- `author` (Relation, many-to-one with Authors)
- `siteType` (Enumeration: dev, tattoo, both)
- `featured` (Boolean)

### 2. Categories

**Fields**:
- `name` (Text)
- `slug` (UID, based on name)
- `description` (Text, long)
- `posts` (Relation, many-to-many with Posts)

### 3. Authors

**Fields**:
- `name` (Text)
- `bio` (Text, long)
- `avatar` (Media, single)
- `posts` (Relation, one-to-many with Posts)

### 4. Projects (Developer Portfolio)

**Fields**:
- `title` (Text)
- `slug` (UID, based on title)
- `description` (Text, long)
- `content` (Rich Text)
- `images` (Media, multiple)
- `technologies` (Relation, many-to-many with Technologies)
- `category` (Relation, many-to-one with Project Categories)
- `github` (Text)
- `liveDemo` (Text)
- `featured` (Boolean)
- `publishedAt` (Date)
- `related_projects` (Relation, many-to-many with Projects)

### 5. Project Categories

**Fields**:
- `name` (Text)
- `slug` (UID, based on name)
- `description` (Text, long)
- `projects` (Relation, one-to-many with Projects)

### 6. Technologies

**Fields**:
- `name` (Text)
- `slug` (UID, based on name)
- `icon` (Media, single)
- `projects` (Relation, many-to-many with Projects)

### 7. Open Source Projects

**Fields**:
- `name` (Text)
- `description` (Text, long)
- `image` (Media, single)
- `url` (Text)
- `github` (Text)
- `stars` (Number)
- `forks` (Number)
- `language` (Text)
- `featured` (Boolean)

### 8. Tattoo Works (Tattoo Portfolio)

**Fields**:
- `title` (Text)
- `slug` (UID, based on title)
- `description` (Text, long)
- `images` (Media, multiple)
- `styles` (Relation, many-to-many with Tattoo Styles)
- `details` (Component, repeatable - with fields: `label` and `value`)
- `story` (Rich Text)
- `featured` (Boolean)
- `publishedAt` (Date)
- `related_works` (Relation, many-to-many with Tattoo Works)

### 9. Tattoo Styles

**Fields**:
- `name` (Text)
- `slug` (UID, based on name)
- `description` (Text, long)
- `image` (Media, single)
- `works` (Relation, many-to-many with Tattoo Works)

### 10. Testimonials

**Fields**:
- `client_name` (Text)
- `project` (Text)
- `quote` (Text, long)
- `rating` (Number, 1-5)
- `client_image` (Media, single)
- `tattoo_image` (Media, single)
- `featured` (Boolean)
- `publishedAt` (Date)

### 11. Global Settings

**Fields**:
- `dev_site_meta_title` (Text)
- `dev_site_meta_description` (Text)
- `tattoo_site_meta_title` (Text)
- `tattoo_site_meta_description` (Text)
- `dev_social_links` (Component, non-repeatable - with fields for each social platform)
- `tattoo_social_links` (Component, non-repeatable - with fields for each social platform)
- `contact_form_email` (Email)

## Components Setup

Create the following components in Strapi:

### 1. Social Links (Global)

**Fields**:
- `github` (Text)
- `linkedin` (Text)
- `twitter` (Text)
- `instagram` (Text)
- `email` (Email)

### 2. Detail (Tattoo Works)

**Fields**:
- `label` (Text)
- `value` (Text)

## API Permissions

1. Go to **Settings** > **Roles** > **Public**.
2. Enable the following permissions for each content type:
   - Find
   - FindOne

3. Go to **Settings** > **Roles** > **Authenticated**.
4. Enable appropriate permissions based on who will be editing content.

## Sample Data

Add some sample data to each content type to test the integration with the frontend:
- Create a few blog posts for both developer and tattoo sections
- Add projects for the developer portfolio
- Add tattoo works for the tattoo portfolio
- Add testimonials
- Set up global settings

## Deployment

For deployment, you have several options:
1. Self-host on a VPS like DigitalOcean, AWS, etc.
2. Use a PaaS like Heroku or Render
3. Use Strapi Cloud (paid service)

Remember to secure your production environment by setting proper environment variables and restricting API access as needed. 