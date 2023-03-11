<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import { createEventDispatcher, onDestroy } from "svelte";
  import type { z } from "zod";

  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import Alert from "$lib/components/Alert.svelte";
  import { createValidatedForm } from "$lib/form/createValidatedForm";
  import TextInput from "$lib/form/TextInput.svelte";
  import type { FailResult, FormError } from "$lib/utils/validate";

  import { addEmailSchema } from "./schema";
  import { invalidateAll } from "$app/navigation";

  const { form, errors, setErrors, isSubmitting } =
    createValidatedForm<typeof addEmailSchema>(addEmailSchema);

  let formError: FormError | undefined = undefined;

  const dispatch = createEventDispatcher<{ complete: undefined }>();

  onDestroy(
    page.subscribe(({ form }) => {
      if (form?.fieldErrors) {
        const failResult = form as FailResult<
          z.infer<typeof addEmailSchema>,
          typeof addEmailSchema
        >;
        formError = failResult.formError;
        if (failResult.fieldErrors) {
          setErrors(failResult.fieldErrors);
        }
      }
      if (form?.success) {
        // TODO: remove when houdini cache handling works properly: see
        // https://github.com/HoudiniGraphql/houdini/discussions/981
        invalidateAll();
        dispatch("complete");
      }
    })
  );
</script>

<form method="POST" use:form action="?/addEmail">
  <TextInput
    name="email"
    type="email"
    autocomplete="email"
    error={browser ? $errors.email : $page.form?.fieldErrors?.email}
  >
    <svelte:fragment slot="label">E-mail</svelte:fragment>
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
      {/if}Add Email</button
    >
    <button class="btn" type="button" on:click={() => dispatch("complete")}
      >Cancel</button
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
</form>
