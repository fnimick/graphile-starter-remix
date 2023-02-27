import { load_SettingsProfileNew } from "$houdini";

import type { LayoutLoadEvent } from "./$types";

export async function load(event: LayoutLoadEvent) {
  return {
    limitContentWidth: false,
    ...(await load_SettingsProfileNew({ event })),
  };
}
