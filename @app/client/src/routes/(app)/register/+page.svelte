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
  import { isSafe } from "$lib/utils/uri";
  import type { FailResult, FormError } from "$lib/utils/validate";

  import { registerSchema } from "./schema";

  $: rawNext = $page.url.searchParams.get("next");
  $: next = isSafe(rawNext) ? rawNext : "/";

  const { form, errors, setErrors, isSubmitting } =
    createValidatedForm<typeof registerSchema>(registerSchema);

  let formError: FormError | undefined = undefined;

  onDestroy(
    page.subscribe(({ form }) => {
      if (form?.fieldErrors) {
        const failResult = form as FailResult<
          z.infer<typeof registerSchema>,
          typeof registerSchema
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
  class="flex w-full max-w-lg flex-col gap-y-2 p-2 lg:p-4"
>
  <input type="hidden" name="text" value={next} />
  <TextInput
    name="name"
    required
    type="text"
    autocomplete="name"
    error={browser ? $errors.name : $page.form?.fieldErrors?.name}
    value={browser ? undefined : $page.form?.values?.name}
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
    error={browser ? $errors.username : $page.form?.fieldErrors?.username}
    value={browser ? undefined : $page.form?.values?.username}
  >
    <svelte:fragment slot="label"
      ><span data-cy="registerpage-name-label" class="flex items-center">
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
    error={browser ? $errors.email : $page.form?.fieldErrors?.email}
    value={browser ? undefined : $page.form?.values?.email}
  >
    <svelte:fragment slot="label">E-mail</svelte:fragment>
  </TextInput>
  <TextInput
    name="password"
    type="password"
    autocomplete="new-password"
    error={browser ? $errors.password : $page.form?.fieldErrors?.password}
    value={browser ? undefined : $page.form?.values?.password}
  >
    <svelte:fragment slot="label">Passphrase</svelte:fragment>
  </TextInput>
  <TextInput
    name="confirm"
    type="password"
    autocomplete="new-password"
    error={browser ? $errors.confirm : $page.form?.fieldErrors?.confirm}
    value={browser ? undefined : $page.form?.values?.confirm}
  >
    <svelte:fragment slot="label">Confirm Passphrase</svelte:fragment>
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
      {/if}Create Account</button
    >

    <a class="link self-center" href="/login">
      Use a different sign in method
    </a>
  </div>
  {#if formError}
    <Alert
      alertType="error"
      title="Account creation failed"
      message={formError.message}
      code={formError.code}
    />
  {/if}
</form>
