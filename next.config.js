import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  turbopack: {
    root: __dirname,
  },
  rewrites: async () => {
    return [
      {
        source: "/",
        destination: "/home",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default config;
