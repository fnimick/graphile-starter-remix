import { fail } from "@sveltejs/kit";

import type { Actions } from "./$types";

export const actions: Actions = {
  default: async (event) => {
    return fail(400, { error: true, errors: { test: "failure" } });
  },
};
