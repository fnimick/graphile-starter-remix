<script lang="ts">
  import Alert from "$lib/components/Alert.svelte";
</script>

<Alert
  alertType="success"
  title="Password successfully reset!"
  class="m-8 max-w-lg"
>
  You can now <a href="/login/email">log in</a> with your new password.
</Alert>
