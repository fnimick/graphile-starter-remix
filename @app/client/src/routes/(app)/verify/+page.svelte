<script lang="ts">
  import Alert from "$lib/components/Alert.svelte";

  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="w-full max-w-lg">
  <div class="m-8">
    {#if data?.verifyEmailSuccess}
      <Alert alertType="success" title="Email Verified">
        Thank you for verifying your email address. You may now close this
        window.
      </Alert>
    {:else if data?.verifyEmailError}
      <Alert alertType="error" title="Verification Failed"
        >{data.verifyEmailError}</Alert
      >
    {/if}
  </div>
</div>
