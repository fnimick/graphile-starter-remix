<script lang="ts">
  import { AppShell } from "@skeletonlabs/skeleton";

  import Navigation from "$lib/layout/Navigation.svelte";

  import type { PageData } from "./$houdini";

  export let data: PageData;
  // We use this rather than `data.currentUser` because the Houdini query
  // auto-updates along with any user record received from the
  // CurrentUserUpdated subscription.
  const { SettingsProfile } = data;
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
  <svelte:fragment slot="sidebarLeft">
    <Navigation currentUser={$SettingsProfile.data?.currentUser} />
  </svelte:fragment>
  <slot />
</AppShell>
