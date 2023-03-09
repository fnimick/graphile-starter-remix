import { requireNoUser } from "$lib/utils/users";

import type { PageLoadEvent } from "./$types";

export async function load(event: PageLoadEvent) {
  const parentData = await event.parent();
  await requireNoUser(parentData.currentUser);

  return { pageTitle: "Create Account", hideLogin: true };
}
