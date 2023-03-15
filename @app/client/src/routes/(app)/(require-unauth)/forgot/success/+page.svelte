<script lang="ts">
  import { page } from "$app/stores";
  import Alert from "$lib/components/Alert.svelte";
</script>

<Alert type="success" title="You've got mail!" class="m-8 max-w-lg">
  We've sent an email reset link to <code
    >{$page.url.searchParams.get("email")}</code
  >; click the link and follow the instructions. If you don't receive the link,
  please ensure you entered the email address correctly, and check in your spam
  folder just in case.
</Alert>
