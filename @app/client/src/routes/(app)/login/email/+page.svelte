<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import { onDestroy } from "svelte";
  import type { z } from "zod";

  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import Alert from "$lib/components/Alert.svelte";
  import { createValidatedForm } from "$lib/form/createValidatedForm";
  import TextInput from "$lib/form/TextInput.svelte";
  import { isSafe } from "$lib/utils/uri";
  import type { FailResult, FormError } from "$lib/utils/validate";

  import { loginSchema } from "./schema";

  $: rawNext = $page.url.searchParams.get("next");
  $: next = isSafe(rawNext) ? rawNext : "/";

  const { form, errors, setErrors, isSubmitting } =
    createValidatedForm<typeof loginSchema>(loginSchema);

  let formError: FormError | undefined = undefined;

  onDestroy(
    page.subscribe(({ form }) => {
      if (form?.fieldErrors) {
        const failResult = form as FailResult<
          z.infer<typeof loginSchema>,
          typeof loginSchema
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
  <input type="hidden" name="next" value={next} />
  <TextInput
    name="username"
    placeholder="E-mail or Username"
    autocomplete="username"
    error={browser ? $errors.username : $page.form?.fieldErrors?.username}
    value={browser ? undefined : $page.form?.values?.username}
  />
  <TextInput
    name="password"
    placeholder="Passphrase"
    type="password"
    autocomplete="current-password"
    error={browser ? $errors.password : $page.form?.fieldErrors?.password}
    value={browser ? undefined : $page.form?.values?.password}
  />
  <div class="flex items-center justify-between">
    <button
      type="submit"
      class="btn variant-filled-primary"
      disabled={$isSubmitting}
    >
      {#if $isSubmitting}
        <div class="mr-2 h-6 w-6">
          <ProgressRadial />
        </div>
      {/if}Sign In</button
    >

    <a class="link self-center" href="/login">
      Use a different sign in method
    </a>
  </div>
  {#if formError}
    <Alert
      alertType="error"
      title="Login failed"
      message={formError.message}
      code={formError.code}
    />
  {/if}
</form>
