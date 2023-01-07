import { SharedStore } from "$houdini";

import type { LayoutServerLoadEvent } from "./$types";

export async function load(event: LayoutServerLoadEvent) {
  const Shared = new SharedStore();
  const result = await Shared.fetch({ event });
  const currentUser = result.data?.currentUser;
  return { currentUser };
}
