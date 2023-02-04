<script lang="ts">
  import { validator } from "@felte/validator-zod";
  import { createForm } from "felte";
  import type { z } from "zod";

  import { applyAction, deserialize } from "$app/forms";
  import { page } from "$app/stores";
  import TextInput from "$lib/form/TextInput.svelte";

  import { loginSchema } from "./schema";
  const { form, errors } = createForm<z.infer<typeof loginSchema>>({
    onSuccess: async (event) => {
      console.log("onSubmit");
      const resp = event as Response;
      const result = deserialize(await resp.text());
      applyAction(result);
      console.log(result);
    },
    onError: async (error: any) => {
      console.log("onError called");
      console.log(error);
      if (error.response) {
        const response = error.response;
        console.log(response);
        const result = deserialize(await response.text());
        console.log(result);
        applyAction(result);
      } else {
        applyAction({ type: "error", error });
      }
      console.log(error.response);
    },
    extend: [validator({ schema: loginSchema })],
  });
</script>

<form method="POST" use:form class="flex w-full max-w-lg flex-col gap-y-5">
  <TextInput
    name="email"
    placeholder="E-mail"
    autocomplete="email"
    error={$errors.email}
  />
  <TextInput
    name="password"
    placeholder="Passphrase"
    type="password"
    autocomplete="current-password"
    error={$errors.password}
  />
  <div class="align-center flex justify-between">
    <button type="submit" class="btn-primary btn">Sign In</button>
    <a class="link self-center" href="/login">
      Use a different sign in method
    </a>
  </div>
  <pre>
    {JSON.stringify($errors)}
    {JSON.stringify($page.form)}
    {JSON.stringify($page.status)}
  </pre>
</form>
