<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import { createValidatedForm } from "felte-sveltekit/client";

  import { page } from "$app/stores";
  import Alert from "$lib/components/Alert.svelte";
  import PasswordStrength from "$lib/components/PasswordStrength.svelte";
  import TextInput from "$lib/form/TextInput.svelte";

  import { resetSchema } from "./schema";

  const { form, errors, message, isSubmitting } = createValidatedForm(
    "reset",
    resetSchema
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
    error={$errors.password}
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
    error={$errors.confirm}
  >
    <svelte:fragment slot="label">Confirm Passphrase</svelte:fragment>
  </TextInput>
  {#if $message}
    <Alert title="Reset failed" {...$message} />
  {/if}
  {#if !$page.url.searchParams.get("user_id") || !$page.url.searchParams.get("token")}
    <Alert type="error" title="Invalid Reset Token">
      Please check your email again.
    </Alert>
  {:else}
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
  {/if}
</form>
