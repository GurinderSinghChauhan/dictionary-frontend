import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public'
})

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['dictionary-images-directory.s3.eu-north-1.amazonaws.com'],
  },
};

export default withPWA(nextConfig);
