import type { NextConfig } from "next";

const basePath = '/when-pay-what'

const nextConfig: NextConfig = {
  /* config options here */
  basePath: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  }
};

export default nextConfig;
