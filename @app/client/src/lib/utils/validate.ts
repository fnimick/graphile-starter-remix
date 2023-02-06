import { type Action, type RequestEvent, fail } from "@sveltejs/kit";
import { z } from "zod";

function filterFormDataValues<T, U extends z.ZodTypeDef>(
  formData: FormData,
  valueExcludeFields: Set<keyof z.infer<z.Schema<T, U, unknown>>>
) {
  return Object.fromEntries(
    Array.from(formData).filter(
      ([key]) => !valueExcludeFields.has(key as keyof T)
    )
  );
}

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
  formData: FormData,
  options: ValidateOptions<T, U> = {}
) {
  const { valueExcludeFields = new Set() } = options;
  try {
    const data = await schema.parseAsync(formData);

    return {
      data,
      values: filterFormDataValues(formData, valueExcludeFields),
      errors: undefined,
    };
  } catch (err) {
    if (!(err instanceof z.ZodError)) throw err;
    return {
      data: undefined,
      values: filterFormDataValues(formData, valueExcludeFields),
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

export interface FormError {
  message: string;
  code?: string | null;
}

interface FailArgs<T, U extends z.ZodTypeDef> {
  fieldErrors?: ValidationErrors<T, U>;
  formError?: FormError;
}

export interface FailResult<T, U extends z.ZodTypeDef>
  extends FailArgs<T, U>,
    Record<string, unknown> {
  values: Record<string, FormDataEntryValue>;
}

export interface ValidateOptions<T, U extends z.ZodTypeDef> {
  valueExcludeFields?: Set<keyof z.infer<z.Schema<T, U, unknown>>>;
}

export function validate<T, U extends z.ZodTypeDef>(
  schema: z.Schema<T, U, unknown>,
  action: (
    event: RequestEvent & {
      data: z.infer<z.Schema<T, U, unknown>>;
      fail: (args: FailArgs<T, U>) => ReturnType<typeof fail<FailResult<T, U>>>;
    }
  ) => ReturnType<Action>,
  options: ValidateOptions<T, U> = {}
) {
  const { valueExcludeFields = new Set() } = options;
  return async (event: RequestEvent) => {
    const formData = await event.request.formData();

    const { data, errors, values } = await validateFormDataAsync(
      schema,
      formData,
      options
    );

    if (errors) return fail(400, { values, fieldErrors: errors });

    const result = await action({
      ...event,
      data,
      fail: ({ fieldErrors, formError }: FailArgs<T, U>) =>
        fail(400, {
          values: filterFormDataValues(formData, valueExcludeFields),
          fieldErrors,
          formError,
        }),
    });

    if (result) return result;
  };
}
