module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [0, 'always'], // Disable body line length limit
    'footer-max-line-length': [0, 'always'], // Disable footer line length limit
  },
};

