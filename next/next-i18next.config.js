module.exports = {
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en', 'es'],
    localeDetection: false,
    domains: [
      {
        domain: '127.0.0.1',
        defaultLocale: 'pt',
      },
      {
        domain: '127.0.0.2',
        defaultLocale: 'en',
      },
      {
        domain: '127.0.0.3',
        defaultLocale: 'es',
      }
    ]
  }
};
