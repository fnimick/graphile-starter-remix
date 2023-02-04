import { type Action, type RequestEvent, fail } from "@sveltejs/kit";
import { z } from "zod";

export function validateFormData<T, U extends z.ZodTypeDef>(
  schema: z.Schema<T, U, unknown>,
  formData: FormData
) {
  try {
    const data = schema.parse(formData);

    return {
      data,
      values: Object.fromEntries(formData),
      errors: null,
    };
  } catch (err) {
    if (!(err instanceof z.ZodError)) throw err;
    return {
      data: undefined,
      values: Object.fromEntries(formData),
      errors: Object.fromEntries(
        Object.entries(err.formErrors.fieldErrors).map(([key, value]) => [
          key,
          value ? value[0] : null,
        ])
      ),
    };
  }
}

export async function validateFormDataAsync<T, U extends z.ZodTypeDef>(
  schema: z.Schema<T, U, unknown>,
  formData: FormData
) {
  try {
    const data = await schema.parseAsync(formData);

    return {
      data,
      values: Object.fromEntries(formData),
      errors: undefined,
    };
  } catch (err) {
    if (!(err instanceof z.ZodError)) throw err;
    return {
      data: undefined,
      values: Object.fromEntries(formData),
      errors: Object.fromEntries(
        Object.entries(err.formErrors.fieldErrors).map(([key, value]) => [
          key,
          value ? value[0] : null,
        ])
      ),
    };
  }
}

type ValidationErrors<T, U extends z.ZodTypeDef> = Partial<
  Record<keyof z.infer<z.Schema<T, U, unknown>>, string | null | undefined>
>;

interface FailArgs<T, U extends z.ZodTypeDef> {
  fieldErrors: ValidationErrors<T, U>;
  formError?: string;
}

interface FailResult<T, U extends z.ZodTypeDef>
  extends FailArgs<T, U>,
    Record<string, unknown> {
  values: Record<string, FormDataEntryValue>;
}

export function validate<T, U extends z.ZodTypeDef>(
  schema: z.Schema<T, U, unknown>,
  action: (
    event: RequestEvent & {
      data: z.infer<z.Schema<T, U, unknown>>;
      fail: (args: FailArgs<T, U>) => ReturnType<typeof fail<FailResult<T, U>>>;
    }
  ) => ReturnType<Action>
) {
  return async (event: RequestEvent) => {
    const formData = await event.request.formData();

    const { data, errors, values } = await validateFormDataAsync(
      schema,
      formData
    );

    if (errors) return fail(400, { values, errors });

    const result = await action({
      ...event,
      data,
      fail: ({ fieldErrors, formError }: FailArgs<T, U>) =>
        fail(400, {
          values: Object.fromEntries(formData),
          fieldErrors,
          formError,
        }),
    });

    if (result) return result;
  };
}
