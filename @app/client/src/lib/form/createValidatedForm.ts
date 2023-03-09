import { applyAction, deserialize } from "$app/forms";
import { validator } from "@felte/validator-zod";
import type { FormConfigWithoutTransformFn } from "@felte/core";
import { createForm } from "felte";
import type { ZodSchema, z } from "zod";

type Obj = Record<string, any>;
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
      applyAction(result);
    },
    onError: async (error: any) => {
      if (error.response) {
        const { response } = error;
        const result = deserialize(await response.text());
        applyAction(result);
      } else {
        applyAction({ type: "error", error });
      }
    },
    extend: [validator({ schema })],
    ...config,
  });
}
