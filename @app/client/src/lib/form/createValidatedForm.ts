import type { FormConfigWithoutTransformFn } from "@felte/core";
import { validator } from "@felte/validator-zod";
import { createForm, FelteSubmitError } from "felte";
import type { z, ZodSchema } from "zod";

import { applyAction, deserialize } from "$app/forms";
import { invalidateAll } from "$app/navigation";

export function createValidatedForm<T extends ZodSchema>(
  schema: ZodSchema,
  config?: Exclude<
    FormConfigWithoutTransformFn<z.infer<T>>,
    "onSuccess" | "onError" | "extend"
  >
) {
  return createForm<z.infer<T>>({
    onSuccess: async (event: unknown) => {
      const resp = event as Response;
      const result = deserialize(await resp.text());
      // Match the behavior of `use:enhance`, invalidate all on success
      if (result.type === "success") {
        await invalidateAll();
      }
      applyAction(result);
    },
    onError: async (error: unknown) => {
      if (error instanceof FelteSubmitError) {
        if (error.response) {
          const { response } = error;
          const result = deserialize(await response.text());
          applyAction(result);
        } else {
          applyAction({ type: "error", error });
        }
      }
    },
    extend: [validator({ schema })],
    ...config,
  });
}
