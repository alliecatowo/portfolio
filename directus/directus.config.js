// This file allows you to override or extend the default Directus configuration.
// See https://docs.directus.io/self-hosted/config-options.html.

module.exports = function (env) {
  return {
    // Define custom hooks for events
    hooks: {
      // "items.create.articles": function (input, { schema, database }) {
      //   input = { ...input, notify: true };
      //   return input;
      // }
    },
    
    // Configure custom storage adapters
    storage: {
      // storage-local provides persistent file storage
      local: {
        driver: "local",
        root: "/directus/uploads"
      }
    }
  };
}; 