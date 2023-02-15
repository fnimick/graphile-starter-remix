import { redirect } from "@sveltejs/kit";

import { LogoutStore } from "$houdini";

import type { Actions, RequestEvent } from "./$types";

export const actions: Actions = {
  default: async (event: RequestEvent) => {
    const logoutMutation = new LogoutStore();

    await logoutMutation.mutate(null, { event });
    throw redirect(302, "/");
  },
};
