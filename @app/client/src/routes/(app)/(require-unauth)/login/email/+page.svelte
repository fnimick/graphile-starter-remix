<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import { createValidatedForm } from "felte-sveltekit/client";

  import { page } from "$app/stores";
  import Alert from "$lib/components/Alert.svelte";
  import TextInput from "$lib/form/TextInput.svelte";
  import { isSafe } from "$lib/utils/uri";

  import { loginSchema } from "./schema";

  $: rawNext = $page.url.searchParams.get("next");
  $: next = isSafe(rawNext) ? rawNext : "/";

  const { form, data, errors, message, isSubmitting } = createValidatedForm(
    "login",
    loginSchema
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
    error={$errors.username}
    value={$data?.username}
    data-cy="loginpage-input-username"
  />
  <TextInput
    name="password"
    placeholder="Passphrase"
    type="password"
    autocomplete="current-password"
    error={$errors.password}
    value={$data?.password}
    data-cy="loginpage-input-password"
  />
  <a class="mb-6" href="/forgot"> Forgotten passphrase?</a>
  {#if $message}
    <Alert title="Login failed" {...$message} />
  {/if}
  <div class="flex items-center justify-between">
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
      {/if}Sign In</button
    >
    <a class="link self-center" href="/login">
      Use a different sign in method
    </a>
  </div>
</form>
