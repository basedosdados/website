module.exports = {
  images: {
    disableStaticImages: true,
    domains: [
      "basedosdados.org",
      "basedosdados-static.s3.us-east-2.amazonaws.com"
    ]
  },
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};
