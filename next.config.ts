import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  // One generated client chunk is just over the default 2 MiB precache ceiling.
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
});

const nextConfig: NextConfig = {
  images: {
    domains: ["dictionary-images-directory.s3.eu-north-1.amazonaws.com"],
  },
};

export default withPWA(nextConfig);
