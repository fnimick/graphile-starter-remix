<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import { onDestroy } from "svelte";
  import type { z } from "zod";

  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import Alert from "$lib/components/Alert.svelte";
  import { createValidatedForm } from "$lib/form/createValidatedForm";
  import TextInput from "$lib/form/TextInput.svelte";
  import type { FailResult, FormError } from "$lib/utils/validate";

  import { forgotSchema } from "./schema";

  const { form, errors, setErrors, isSubmitting } =
    createValidatedForm<typeof forgotSchema>(forgotSchema);

  let formError: FormError | undefined = undefined;

  onDestroy(
    page.subscribe(({ form }) => {
      if (form?.fieldErrors || form?.formError) {
        const failResult = form as FailResult<
          z.infer<typeof forgotSchema>,
          typeof forgotSchema
        >;
        formError = failResult.formError;
        if (failResult.fieldErrors) {
          setErrors(failResult.fieldErrors);
        }
      }
    })
  );
</script>

<form
  method="POST"
  use:form
  class="flex w-full max-w-lg flex-col gap-y-5 p-2 lg:p-4"
>
  <TextInput
    name="email"
    placeholder="E-mail"
    type="email"
    autocomplete="email"
    error={browser ? $errors.email : $page.form?.fieldErrors?.email}
    value={browser ? undefined : $page.form?.values?.email}
    data-cy="forgotpage-input-email"
  />
  {#if formError}
    <Alert
      alertType="error"
      title="Forgot password failed"
      message={formError.message}
      code={formError.code}
    />
  {/if}
  <button
    type="submit"
    class="btn variant-filled-primary"
    disabled={$isSubmitting}
    data-cy="loginpage-button-submit"
  >
    {#if $isSubmitting}
      <div class="mr-2 h-6 w-6">
        <ProgressRadial />
      </div>
    {/if}Reset password</button
  >
  <a class="link self-center" href="/login">
    Remembered your password? Log in.
  </a>
</form>
