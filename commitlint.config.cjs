module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        // House style (CLAUDE.md): a subject plus a description body, never an AI co-author trailer.
        'no-co-authored-by': (parsed) => {
          const found = /^co-authored-by:/im.test(parsed.raw || '');
          return [!found, 'commit message must not contain a Co-Authored-By trailer'];
        },
        'body-required': (parsed) => {
          const merge = /^(Merge|Revert) /.test(parsed.header || '');
          return [merge || Boolean((parsed.body || '').trim()), 'commit needs a description body (what changed and why)'];
        },
      },
    },
  ],
  rules: {
    'body-max-line-length': [0, 'always'], // Disable body line length limit
    'footer-max-line-length': [0, 'always'], // Disable footer line length limit
    'no-co-authored-by': [2, 'always'],
    'body-required': [1, 'always'], // warning only: Dependabot and GitHub-made commits may lack a body,
  },
};
