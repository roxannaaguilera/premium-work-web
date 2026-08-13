import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The hero uses detailed photographic assets; preserve their fidelity on high-DPI phones.
    qualities: [75, 90],
  },
};

export default nextConfig;
