<script lang="ts">
  import { popup, ProgressRadial } from "@skeletonlabs/skeleton";
  import { createValidatedForm } from "felte-sveltekit/client";
  import { onDestroy } from "svelte";

  import IonHelpCircleOutline from "~icons/ion/help-circle-outline";
  import Alert from "$lib/components/Alert.svelte";
  import TextInput from "$lib/form/TextInput.svelte";

  import type { PageData } from "./$types";
  import { profileSchema } from "./schema";

  export let data: PageData;
  const { SettingsProfile } = data;

  const {
    form,
    data: formData,
    errors,
    message,
    result,
    isSubmitting,
  } = createValidatedForm(
    "profile",
    profileSchema,
    {
      initialValues: {
        name: $SettingsProfile.data?.currentUser?.name ?? undefined,
        username: $SettingsProfile.data?.currentUser?.username ?? undefined,
      },
    },
    {
      // Don't reset form after successful submission
      submit:
        () =>
        ({ update }) =>
          update({ reset: false }),
    }
  );

  let success = false;

  onDestroy(
    result.subscribe((val) => {
      if (
        typeof val === "object" &&
        val != null &&
        "success" in val &&
        val.success === true
      ) {
        success = true;
      }
    })
  );
</script>

<form
  method="POST"
  use:form
  class="flex w-full max-w-lg flex-col gap-y-2 p-2 lg:p-4"
>
  <TextInput
    name="name"
    required
    type="text"
    autocomplete="name"
    error={$errors.name}
    value={$formData.name ?? ""}
    on:input={() => {
      success = false;
    }}
    data-cy="settingsprofile-input-name"
  >
    <svelte:fragment slot="label">
      <span data-cy="settingsprofile-name-label" class="flex items-center">
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
    value={$formData.username ?? ""}
    on:input={() => {
      success = false;
    }}
    data-cy="settingsprofile-input-username"
  >
    <svelte:fragment slot="label"
      ><span data-cy="settingsprofile-name-label" class="flex items-center">
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
  <div class="flex items-center justify-between">
    <button
      type="submit"
      class="btn variant-filled-primary"
      disabled={$isSubmitting}
      data-cy="settingsprofile-button-submit"
    >
      {#if $isSubmitting}
        <div class="mr-2 h-6 w-6">
          <ProgressRadial />
        </div>
      {/if}Update Profile</button
    >
  </div>
  {#if $message}
    <Alert title="Error updating profile" {...$message} />
  {/if}
  {#if success}
    <Alert type="success" title="Profile successfully updated" />
  {/if}
</form>
