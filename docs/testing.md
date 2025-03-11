# Testing Guide for Portfolio Website

This guide outlines the testing procedures for ensuring the portfolio website functions correctly across all features and environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Local Testing](#local-testing)
- [Component Testing](#component-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Accessibility Testing](#accessibility-testing)
- [Performance Testing](#performance-testing)
- [Cross-Browser Testing](#cross-browser-testing)
- [Mobile Responsiveness Testing](#mobile-responsiveness-testing)
- [Content Management Testing](#content-management-testing)
- [Pre-Deployment Testing Checklist](#pre-deployment-testing-checklist)
- [Post-Deployment Testing](#post-deployment-testing)
- [Continuous Integration](#continuous-integration)
- [Troubleshooting Common Testing Issues](#troubleshooting-common-testing-issues)

## Prerequisites

Before beginning testing, ensure you have:

- Node.js and npm installed
- Access to the repository
- Environment variables properly configured
- Strapi CMS running (for content-related tests)
- Testing libraries installed:
  - Jest for unit testing
  - React Testing Library for component testing
  - Cypress for end-to-end testing
  - Lighthouse for performance testing

## Local Testing

### Setting Up the Testing Environment

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file based on `.env.example`
   - Configure necessary API endpoints and tokens

4. Start the development server:
   ```bash
   npm run dev
   ```

### Manual Testing Workflow

1. Access the local development server at `http://localhost:3000`
2. Test navigation between pages
3. Verify all content loads correctly
4. Test interactive elements (buttons, forms, etc.)
5. Check both developer and tattoo artist portfolio views

## Component Testing

Run component tests to verify individual UI components function correctly:

```bash
npm run test
```

### Key Components to Test

- Navigation bar
- Portfolio grid
- Project details
- Contact form
- Theme switcher
- Image galleries
- Responsive layout components

### Writing Component Tests

Example of a component test using React Testing Library:

```javascript
import { render, screen } from '@testing-library/react';
import NavBar from '../components/NavBar';

describe('NavBar', () => {
  it('renders navigation links correctly', () => {
    render(<NavBar />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});
```

## Integration Testing

Test how components work together:

1. Test data flow between components
2. Verify state management
3. Test routing and navigation
4. Verify API integration with Strapi CMS

## End-to-End Testing

Run Cypress tests to verify complete user flows:

```bash
npm run cypress:open
```

### Key User Flows to Test

1. **Portfolio Browsing Flow**
   - Navigate to the homepage
   - Browse portfolio items
   - View project details
   - Return to the portfolio grid

2. **Contact Form Flow**
   - Navigate to the contact page
   - Fill out the contact form
   - Submit the form
   - Verify success message

3. **Theme Switching Flow**
   - Toggle between light and dark themes
   - Verify visual changes

4. **Developer/Tattoo Artist Site Switching**
   - Test the mechanism to switch between portfolio types
   - Verify correct content loads for each type

## Accessibility Testing

Ensure the website is accessible to all users:

1. Run automated accessibility tests:
   ```bash
   npm run test:a11y
   ```

2. Manual accessibility checks:
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast
   - Text scaling
   - Focus indicators

3. Use browser extensions like axe DevTools or WAVE

## Performance Testing

Measure and optimize website performance:

1. Run Lighthouse tests:
   ```bash
   npm run lighthouse
   ```

2. Key metrics to monitor:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - Time to Interactive (TTI)
   - Total Blocking Time (TBT)

3. Image optimization checks:
   - Verify images are properly sized and compressed
   - Check for lazy loading implementation

## Cross-Browser Testing

Test the website across different browsers:

1. Chrome
2. Firefox
3. Safari
4. Edge

Verify consistent appearance and functionality across all browsers.

## Mobile Responsiveness Testing

Test the website on various device sizes:

1. Use browser developer tools to simulate different devices
2. Test on actual mobile devices when possible
3. Verify breakpoints work correctly
4. Check touch interactions

## Content Management Testing

Test the integration with Strapi CMS:

1. Create test content in Strapi
2. Verify content appears correctly on the website
3. Test content updates and publishing workflow
4. Verify media (images, videos) display correctly

## Pre-Deployment Testing Checklist

Complete this checklist before deploying to production:

- [ ] All unit and component tests pass
- [ ] End-to-end tests pass
- [ ] Accessibility tests pass
- [ ] Performance meets targets
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness verified
- [ ] Content loads correctly from CMS
- [ ] Forms submit correctly
- [ ] Links work properly
- [ ] Images and media display correctly
- [ ] Build process completes without errors

## Post-Deployment Testing

After deploying to production:

1. Verify the website loads correctly at the production URL
2. Test all key user flows in the production environment
3. Verify analytics are tracking correctly
4. Check performance in the production environment
5. Verify custom domains are working properly

## Continuous Integration

Set up automated testing in the CI pipeline:

1. Configure GitHub Actions to run tests on pull requests
2. Set up automatic deployment previews
3. Implement status checks to prevent merging failing code

Example GitHub Actions workflow:

```yaml
name: Test and Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run build
        run: npm run build
```

## Troubleshooting Common Testing Issues

### Jest Test Failures

- Check for outdated snapshots: `npm test -- -u`
- Verify test environment variables
- Check for component dependencies that need mocking

### Cypress Test Failures

- Verify selectors are stable and unique
- Check for timing issues with `cy.wait()`
- Ensure the application state is consistent before tests

### Performance Issues

- Check image sizes and formats
- Review third-party scripts
- Analyze bundle size: `npm run analyze`
- Implement code splitting where appropriate

### Content Loading Issues

- Verify Strapi API is accessible
- Check authentication tokens
- Review API response structure 