<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import { createValidatedForm } from "felte-sveltekit/client";
  import { createEventDispatcher, onDestroy } from "svelte";

  import Alert from "$lib/components/Alert.svelte";
  import TextInput from "$lib/form/TextInput.svelte";

  import { addEmailSchema } from "./schema";

  const { form, errors, message, result, isSubmitting } = createValidatedForm(
    "add_email",
    addEmailSchema
  );

  const dispatch = createEventDispatcher<{ complete: undefined }>();

  onDestroy(
    result.subscribe((val) => {
      if (
        typeof val === "object" &&
        val != null &&
        "success" in val &&
        val.success === true
      ) {
        dispatch("complete");
      }
    })
  );
</script>

<form method="POST" use:form action="?/add_email">
  <TextInput
    name="email"
    type="email"
    autocomplete="email"
    error={$errors.email}
    data-cy="settingsemails-input-email"
  >
    <svelte:fragment slot="label">E-mail</svelte:fragment>
  </TextInput>

  <div class="flex items-center justify-between">
    <button
      type="submit"
      class="btn variant-filled-primary"
      disabled={$isSubmitting}
      data-cy="settingsemails-button-submit"
    >
      {#if $isSubmitting}
        <div class="mr-2 h-6 w-6">
          <ProgressRadial />
        </div>
      {/if}
      Add Email
    </button>
    <button class="btn" type="button" on:click={() => dispatch("complete")}>
      Cancel
    </button>
  </div>
  {#if $message}
    <Alert title="Error adding email" {...$message} />
  {/if}
</form>
