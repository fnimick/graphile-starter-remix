<script lang="ts">
  import { popup, ProgressRadial } from "@skeletonlabs/skeleton";
  import { onDestroy } from "svelte";
  import type { z } from "zod";

  import IonHelpCircleOutline from "~icons/ion/help-circle-outline";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import Alert from "$lib/components/Alert.svelte";
  import { createValidatedForm } from "$lib/form/createValidatedForm";
  import TextInput from "$lib/form/TextInput.svelte";
  import type { FailResult, FormError } from "$lib/utils/validate";

  import type { PageData } from "./$types";
  import { profileSchema } from "./schema";

  export let data: PageData;
  const { SettingsProfile } = data;

  const { form, errors, setErrors, isSubmitting } = createValidatedForm<
    typeof profileSchema
  >(profileSchema, {
    initialValues: {
      name: $SettingsProfile.data?.currentUser?.name ?? undefined,
      username: $SettingsProfile.data?.currentUser?.username ?? undefined,
    },
  });

  let formError: FormError | undefined = undefined;
  let success = false;

  onDestroy(
    page.subscribe(({ form }) => {
      if (form?.fieldErrors) {
        const failResult = form as FailResult<
          z.infer<typeof profileSchema>,
          typeof profileSchema
        >;
        formError = failResult.formError;
        if (failResult.fieldErrors) {
          setErrors(failResult.fieldErrors);
        }
      }
      if (form?.success) {
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
    error={browser ? $errors.name : $page.form?.fieldErrors?.name}
    value={browser
      ? undefined
      : $page.form?.values?.name || $SettingsProfile.data?.currentUser?.name}
    on:input={() => {
      success = false;
    }}
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
    error={browser ? $errors.username : $page.form?.fieldErrors?.username}
    value={browser
      ? undefined
      : $page.form?.values?.username ||
        $SettingsProfile.data?.currentUser?.username}
    on:input={() => {
      success = false;
    }}
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
    >
      {#if $isSubmitting}
        <div class="mr-2 h-6 w-6">
          <ProgressRadial />
        </div>
      {/if}Update Profile</button
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
    <Alert alertType="success" title="Profile successfully updated" />
  {/if}
</form>
