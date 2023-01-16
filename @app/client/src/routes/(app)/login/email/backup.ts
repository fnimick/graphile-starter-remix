import { fail } from "@sveltejs/kit";
import * as z from "zod";

import { LoginStore } from "$houdini";

import type { Actions } from "./$types";

const loginSchema = z.object({
  email: z.string().min(1, "Please input your email"),
  password: z.string().min(1, "Please input your passphrase"),
  redirectTo: z.string().optional(),
});

export const actions: Actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    const loginData = loginSchema.safeParse(formData);

    if (!loginData.success) {
      console.log("validation error");
      // Loop through the errors array and create a custom errors array
      const errors = loginData.error.errors.map((error) => {
        return {
          field: error.path[0],
          message: error.message,
        };
      });

      return fail(400, { error: true, errors });
    }

    const { email, password } = loginData.data;

    const loginMutation = new LoginStore();

    try {
      const result = await loginMutation.mutate(
        { username: email, password },
        event
      );
    } catch (e) {
      console.log(JSON.stringify(e));
    }
    // console.log(JSON.stringify(result));
  },
};
