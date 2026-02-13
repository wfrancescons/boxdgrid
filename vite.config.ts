import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
// import lucidePreprocess from "vite-plugin-lucide-preprocess";

export default defineConfig({
  plugins: [
    // lucidePreprocess(),
    fresh(),
    tailwindcss(),
    ,
  ],
  ssr: {
    external: [
      "daisyui",
    ],
  },
});
