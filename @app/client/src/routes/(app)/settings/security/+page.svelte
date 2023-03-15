<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import { createValidatedForm } from "felte-sveltekit/client";

  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import Alert from "$lib/components/Alert.svelte";
  import PasswordStrength from "$lib/components/PasswordStrength.svelte";
  import TextInput from "$lib/form/TextInput.svelte";

  import { securitySchema } from "./schema";

  const { form, errors, message, isSubmitting } = createValidatedForm(
    "security",
    securitySchema
  );

  let passwordText = "";
  let passwordDirty = false;
  function onPasswordChange(event: Event) {
    const target = event.target as HTMLInputElement;
    passwordText = target.value;
    passwordDirty = true;
  }
</script>

<form
  method="POST"
  use:form
  class="flex w-full max-w-lg flex-col gap-y-2 p-2 lg:p-4"
>
  <TextInput
    name="oldPassword"
    type="password"
    autocomplete="current-password"
    error={browser ? $errors.oldPassword : $page.form?.fieldErrors?.oldPassword}
    data-cy="securitypage-input-oldpassword"
  >
    <svelte:fragment slot="label">Current Passphrase</svelte:fragment>
  </TextInput>
  <TextInput
    name="newPassword"
    type="password"
    autocomplete="new-password"
    error={browser ? $errors.newPassword : $page.form?.fieldErrors?.newPassword}
    on:input={onPasswordChange}
    data-cy="securitypage-input-password1"
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
    data-cy="securitypage-input-password2"
  >
    <svelte:fragment slot="label">Confirm New Passphrase</svelte:fragment>
  </TextInput>

  <div class="flex items-center justify-between">
    <button
      type="submit"
      class="btn variant-filled-primary"
      disabled={$isSubmitting}
      data-cy="securitypage-button-submit"
    >
      {#if $isSubmitting}
        <div class="mr-2 h-6 w-6">
          <ProgressRadial />
        </div>
      {/if}Change Passphrase</button
    >
  </div>
  {#if $message}
    <Alert {...$message} />
  {/if}
</form>
