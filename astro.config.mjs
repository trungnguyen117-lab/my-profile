// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://my-blog-vert-sigma.vercel.app",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
  image: {
    remotePatterns: [{ protocol: "https", hostname: "**.amazonaws.com" }],
  },
});
