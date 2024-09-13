module.exports = {
  i18n: {
    locales: ['en', 'pt', 'es'],
    defaultLocale: 'pt',
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
