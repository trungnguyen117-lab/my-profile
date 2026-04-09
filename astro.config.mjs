// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://my-blog-vert-sigma.vercel.app",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel(),
  integrations: [sitemap()],
  image: {
    remotePatterns: [{ protocol: "https", hostname: "**.amazonaws.com" }],
  },
});
