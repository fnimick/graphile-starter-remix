import { load_SettingsProfile } from "$houdini";
import { requireUser } from "$lib/utils/users";

import type { LayoutLoadEvent } from "./$types";

export async function load(event: LayoutLoadEvent) {
  const parentData = await event.parent();
  requireUser(parentData.currentUser, event);
  return {
    ...(await load_SettingsProfile({ event })),
  };
}
