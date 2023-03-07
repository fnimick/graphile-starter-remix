import { sveltekit } from "@sveltejs/kit/vite";
import houdini from "houdini/vite";
import Icons from "unplugin-icons/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
  plugins: [houdini(), sveltekit(), Icons({ compiler: "svelte" })],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
  resolve: {
    // This is necessary for sibling library CommonJS imports to work, e.g.
    // `@app/config`
    preserveSymlinks: true,
  },
  ssr: {
    // Prevent crashes in SSR when Felte forms are used. See
    // https://github.com/pablo-abc/felte/issues/201#issuecomment-1381641343
    noExternal: ["felte"],
  },
};

export default config;
