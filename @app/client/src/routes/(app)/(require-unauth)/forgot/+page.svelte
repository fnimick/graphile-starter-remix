<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import { createValidatedForm } from "felte-sveltekit/client";

  import Alert from "$lib/components/Alert.svelte";
  import TextInput from "$lib/form/TextInput.svelte";

  import { forgotSchema } from "./schema";

  const { form, data, errors, message, isSubmitting } = createValidatedForm(
    "forgot",
    forgotSchema
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
    error={$errors.email}
    value={$data?.email ?? ""}
    data-cy="forgotpage-input-email"
  />
  {#if $message}
    <Alert title="Forgot password failed" {...$message} />
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
