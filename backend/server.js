// server.js
const Strapi = require('@strapi/strapi');

// Create a new instance of Strapi
const strapi = Strapi({ distDir: './dist' });

// Start Strapi
strapi.start(); 