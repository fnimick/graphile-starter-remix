import { type LoadEvent, redirect } from "@sveltejs/kit";

import type { Shared$result } from "$houdini";

// export async function requireNoUser(Shared: SharedStore, event: LoadEvent) {
//   const sharedFetchResult = await Shared.fetch({ event });
//   const currentUser = sharedFetchResult.data?.currentUser;
//   console.log(currentUser);
//   if (currentUser != null) {
//     throw redirect(302, "/");
//   }
// }

// export async function requireUser(Shared: SharedStore, event: LoadEvent) {
//   const sharedFetchResult = await Shared.fetch({ event });
//   const currentUser = sharedFetchResult.data?.currentUser;
//   console.log(currentUser);
//   if (currentUser == null) {
//     const { pathname, search, hash } = event.url;
//     const redirectTo = `${pathname}${search}${hash}`;
//     throw redirect(302, `/login?next=${encodeURIComponent(redirectTo)}`);
//   }
// }

export function requireUser(
  currentUser: Shared$result["currentUser"] | null | undefined,
  event: LoadEvent
) {
  if (currentUser == null) {
    const { pathname, search, hash } = event.url;
    const redirectTo = `${pathname}${search}${hash}`;
    throw redirect(302, `/login?next=${encodeURIComponent(redirectTo)}`);
  }
}

export function requireNoUser(
  currentUser: Shared$result["currentUser"] | null | undefined
) {
  if (currentUser != null) {
    throw redirect(302, "/");
  }
}
