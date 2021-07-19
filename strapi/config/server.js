module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: "http://" + env("HOST", "0.0.0.0") + "/strapi",
  admin: {
    url: "http://" + env("HOST", "0.0.0.0") + "/admin",
    auth: {
      secret: env("ADMIN_JWT_SECRET", "172116ea1aca728cae4e6ed966691262"),
    },
  },
});
