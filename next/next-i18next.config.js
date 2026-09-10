module.exports = {
  // Re-read locale JSON from disk on each prerender in dev, so translation
  // edits show on refresh without restarting the dev server. No effect in
  // production (translations are snapshotted at build time).
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en', 'es'],
    localeDetection: false,
    domains: [
      {
        domain: 'basedosdados.org',
        defaultLocale: 'pt',
      },
      {
        domain: 'data-basis.org',
        defaultLocale: 'en',
      },
      {
        domain: 'basedelosdatos.org',
        defaultLocale: 'es',
      }
    ]
  }
};
