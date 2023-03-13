<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import { onDestroy } from "svelte";
  import type { z } from "zod";

  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import Alert from "$lib/components/Alert.svelte";
  import PasswordStrength from "$lib/components/PasswordStrength.svelte";
  import { createValidatedForm } from "$lib/form/createValidatedForm";
  import TextInput from "$lib/form/TextInput.svelte";
  import type { FailResult, FormError } from "$lib/utils/validate";

  import { resetSchema } from "./schema";

  const { form, errors, setErrors, isSubmitting } =
    createValidatedForm<typeof resetSchema>(resetSchema);

  let formError: FormError | undefined = undefined;

  let passwordText = "";
  let passwordDirty = false;
  function onPasswordChange(event: Event) {
    const target = event.target as HTMLInputElement;
    passwordText = target.value;
    passwordDirty = true;
  }

  onDestroy(
    page.subscribe(({ form }) => {
      if (form?.fieldErrors || form?.formError) {
        const failResult = form as FailResult<
          z.infer<typeof resetSchema>,
          typeof resetSchema
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
  <input
    type="hidden"
    name="userId"
    value={$page.url.searchParams.get("user_id")}
  />
  <input
    type="hidden"
    name="token"
    value={$page.url.searchParams.get("token")}
  />
  <TextInput
    name="password"
    type="password"
    autocomplete="new-password"
    error={browser ? $errors.password : $page.form?.fieldErrors?.password}
    on:input={onPasswordChange}
  >
    <svelte:fragment slot="label">Passphrase</svelte:fragment>
    <svelte:fragment slot="content">
      <PasswordStrength {passwordText} isDirty={passwordDirty} />
    </svelte:fragment>
  </TextInput>
  <TextInput
    name="confirm"
    type="password"
    autocomplete="new-password"
    error={browser ? $errors.confirm : $page.form?.fieldErrors?.confirm}
  >
    <svelte:fragment slot="label">Confirm Passphrase</svelte:fragment>
  </TextInput>
  {#if formError}
    <Alert
      alertType="error"
      title="Reset failed"
      message={formError.message}
      code={formError.code}
    />
  {/if}
  {#if !$page.url.searchParams.get("user_id") || !$page.url.searchParams.get("token")}
    <Alert alertType="error" title="Invalid Reset Token">
      Please check your email again.
    </Alert>
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
    {/if}Reset Password</button
  >
</form>
