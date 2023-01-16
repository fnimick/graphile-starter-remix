<script lang="ts">
  import { createForm } from "felte";
  const { form, errors } = createForm({
    onSuccess: async (event) => {
      const resp = event as Response;
      console.log(await resp.clone().json());
    },
    onError: (errors) => {
      console.log(errors);
      return errors;
    },
  });
</script>

<form method="POST" use:form class="flex w-full max-w-lg flex-col gap-y-5">
  <input
    name="email"
    placeholder="E-mail"
    type="text"
    autoComplete="email"
    class="input-bordered input"
  />
  <input
    name="password"
    placeholder="Passphrase"
    type="password"
    autoComplete="current-password"
    class="input-bordered input"
  />
  <div class="align-center flex justify-between">
    <button type="submit" class="btn-primary btn">Sign In</button>
    <a class="link self-center" href="/login">
      Use a different sign in method
    </a>
  </div>
  <pre>
    {JSON.stringify($errors)}
  </pre>
</form>
