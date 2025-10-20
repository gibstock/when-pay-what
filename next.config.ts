import type { NextConfig } from "next";

const basePath = '/when-pay-what'

const nextConfig: NextConfig = {
  /* config options here */
  basePath: process.env.NODE_ENV === 'production' ? basePath : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  }
};

export default nextConfig;
