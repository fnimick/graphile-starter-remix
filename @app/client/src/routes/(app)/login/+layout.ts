import { requireNoUser } from "$lib/utils/users";

import type { LayoutLoadEvent } from "./$types";

export async function load(event: LayoutLoadEvent) {
  const parentData = await event.parent();
  await requireNoUser(parentData.currentUser);
}
