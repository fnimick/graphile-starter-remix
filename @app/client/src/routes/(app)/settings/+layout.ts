import { load_SettingsProfile } from "$houdini";

import type { LayoutLoadEvent } from "./$types";

export async function load(event: LayoutLoadEvent) {
  return {
    limitContentWidth: false,
    ...(await load_SettingsProfile({ event })),
  };
}
