const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  images: {
    unoptimized: true,
    disableStaticImages: true,
    domains: [
      "basedosdados.org",
      "data-basis.org",
      "basedelosdatos.org",
      "storage.googleapis.com",
    ]
  },
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    port: parseInt(process.env.PORT, 10) || 3000
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ]
  }
};
