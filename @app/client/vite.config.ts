import { sveltekit } from "@sveltejs/kit/vite";
import houdini from "houdini/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [houdini(), sveltekit()],
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
