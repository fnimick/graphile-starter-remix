<script lang="ts">
  import { popup, ProgressRadial } from "@skeletonlabs/skeleton";
  import { createValidatedForm } from "felte-sveltekit/client";

  import IonHelpCircleOutline from "~icons/ion/help-circle-outline";
  import { page } from "$app/stores";
  import Alert from "$lib/components/Alert.svelte";
  import PasswordStrength from "$lib/components/PasswordStrength.svelte";
  import TextInput from "$lib/form/TextInput.svelte";
  import { isSafe } from "$lib/utils/uri";

  import { registerSchema } from "./schema";

  $: rawNext = $page.url.searchParams.get("next");
  $: next = isSafe(rawNext) ? rawNext : "/";

  const { form, data, errors, message, isSubmitting } = createValidatedForm(
    "register",
    registerSchema
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
  <input type="hidden" name="next" value={next} />
  <TextInput
    name="name"
    required
    type="text"
    autocomplete="name"
    error={$errors.name}
    value={$data?.name ?? ""}
    data-cy="registerpage-input-name"
  >
    <svelte:fragment slot="label">
      <span data-cy="registerpage-name-label" class="flex items-center">
        Name&nbsp;
        <span
          use:popup={{
            event: "hover",
            target: "nameTooltip",
            placement: "top",
          }}
        >
          <IonHelpCircleOutline />
        </span>
        <div
          class="card variant-filled-primary z-[999] whitespace-nowrap p-2 text-center text-xs shadow-xl"
          data-popup="nameTooltip"
        >
          What is your name?
          <!-- Arrow -->
          <div class="arrow variant-filled-primary" />
        </div>
      </span>
    </svelte:fragment>
  </TextInput>
  <TextInput
    name="username"
    autocomplete="username"
    error={$errors.username}
    value={$data?.username ?? ""}
    data-cy="registerpage-input-username"
  >
    <svelte:fragment slot="label"
      ><span data-cy="registerpage-username-label" class="flex items-center">
        Username&nbsp;
        <span
          use:popup={{
            event: "hover",
            target: "usernameTooltip",
            placement: "top",
          }}
        >
          <IonHelpCircleOutline />
        </span>
        <div
          class="card variant-filled-primary whitespace-nowrap p-2 text-center text-xs shadow-xl"
          data-popup="usernameTooltip"
        >
          What do you want others to call you?
          <!-- Arrow -->
          <div class="arrow variant-filled-primary" />
        </div>
      </span></svelte:fragment
    >
  </TextInput>
  <TextInput
    name="email"
    autocomplete="email"
    error={$errors.email}
    value={$data?.email ?? ""}
    data-cy="registerpage-input-email"
  >
    <svelte:fragment slot="label">E-mail</svelte:fragment>
  </TextInput>
  <TextInput
    name="password"
    type="password"
    autocomplete="new-password"
    error={$errors.password}
    on:input={onPasswordChange}
    data-cy="registerpage-input-password"
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
    data-cy="registerpage-input-password2"
  >
    <svelte:fragment slot="label">Confirm Passphrase</svelte:fragment>
  </TextInput>
  <div class="flex items-center justify-between">
    <button
      type="submit"
      class="btn variant-filled-primary"
      disabled={$isSubmitting}
      data-cy="registerpage-submit-button"
    >
      {#if $isSubmitting}
        <div class="mr-2 h-6 w-6">
          <ProgressRadial />
        </div>
      {/if}Create Account</button
    >

    <a class="link self-center" href="/login">
      Use a different sign in method
    </a>
  </div>
  {#if $message}
    <Alert title="Account creation failed" {...$message} />
  {/if}
</form>
