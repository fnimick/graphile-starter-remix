import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
  resolve: {
    // This is necessary for sibling library CommonJS imports to work, e.g.
    // `@app/config`
    preserveSymlinks: true,
  },
};

export default config;
