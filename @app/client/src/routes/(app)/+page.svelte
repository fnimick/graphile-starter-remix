<script lang="ts">
  import type { Shared, SharedStore } from "$houdini";

  export let data: { Shared: SharedStore };

  $: foo = data.Shared;
  $: subscribed = $foo;
</script>

<p>testings</p>
<p>{JSON.stringify(subscribed.data)}</p>
