module.exports = {
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
