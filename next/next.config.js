const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
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
