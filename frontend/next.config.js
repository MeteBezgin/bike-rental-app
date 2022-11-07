/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["avatars.dicebear.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/bikes",
        permanent: true,
      },
    ];
  },
};
