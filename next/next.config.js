module.exports = {
  i18n: {
    locales: ['pt', 'en', 'es'],
    defaultLocale: 'pt',
    localeDetection: false
  },
  images: {
    unoptimized: true,
    disableStaticImages: true,
    domains: [
      "basedosdados.org",
      "storage.googleapis.com/basedosdados-website",
    ]
  },
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true
};
