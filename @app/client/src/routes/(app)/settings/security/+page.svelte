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

  import { securitySchema } from "./schema";

  const { form, errors, setErrors, isSubmitting } =
    createValidatedForm<typeof securitySchema>(securitySchema);

  let formError: FormError | undefined = undefined;
  let success = false;

  let passwordText = "";
  let passwordDirty = false;
  function onPasswordChange(event: Event) {
    const target = event.target as HTMLInputElement;
    passwordText = target.value;
    passwordDirty = true;
  }

  let formReference: HTMLFormElement;

  onDestroy(
    page.subscribe(({ form }) => {
      if (form?.fieldErrors) {
        const failResult = form as FailResult<
          z.infer<typeof securitySchema>,
          typeof securitySchema
        >;
        formError = failResult.formError;
        if (failResult.fieldErrors) {
          setErrors(failResult.fieldErrors);
        }
      }
      if (form?.success) {
        success = true;
        passwordDirty = false;
        formReference.reset();
      }
    })
  );
</script>

<form
  method="POST"
  use:form
  bind:this={formReference}
  class="flex w-full max-w-lg flex-col gap-y-2 p-2 lg:p-4"
>
  <TextInput
    name="oldPassword"
    type="password"
    autocomplete="current-password"
    error={browser ? $errors.oldPassword : $page.form?.fieldErrors?.oldPassword}
  >
    <svelte:fragment slot="label">Current Passphrase</svelte:fragment>
  </TextInput>
  <TextInput
    name="newPassword"
    type="password"
    autocomplete="new-password"
    error={browser ? $errors.newPassword : $page.form?.fieldErrors?.newPassword}
    on:input={onPasswordChange}
  >
    <svelte:fragment slot="label">New Passphrase</svelte:fragment>
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
    <svelte:fragment slot="label">Confirm New Passphrase</svelte:fragment>
  </TextInput>

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
      {/if}Change Passphrase</button
    >
  </div>
  {#if formError}
    <Alert
      alertType="error"
      title="Error updating profile"
      message={formError.message}
      code={formError.code}
    />
  {/if}
  {#if success}
    <Alert alertType="success" title="Passphrase changed" />
  {/if}
</form>
