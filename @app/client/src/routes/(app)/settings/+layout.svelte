<script lang="ts">
  import { AppShell, Drawer, drawerStore } from "@skeletonlabs/skeleton";

  import IonMenu from "~icons/ion/menu";
  import Navigation from "$lib/layout/Navigation.svelte";

  import type { PageData } from "./$houdini";

  export let data: PageData;
  // We use this rather than `data.currentUser` because the Houdini query
  // auto-updates along with any user record received from the
  // CurrentUserUpdated subscription.
  const { SettingsProfile } = data;
</script>

<div class="relative w-full">
  <button
    class="btn btn-icon variant-filled-tertiary absolute left-2 top-2 lg:hidden"
    data-cy="settingslayout-drawer-toggle"
    on:click={() => {
      drawerStore.open();
    }}
  >
    <IonMenu class="absolute" />
  </button>
</div>

<Drawer width="w-full max-w-md"
  ><Navigation currentUser={$SettingsProfile.data?.currentUser} /></Drawer
>

<AppShell
  slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64"
  slotPageContent="flex flex-row justify-center mx-8 my-10"
>
  <svelte:fragment slot="sidebarLeft">
    <Navigation currentUser={$SettingsProfile.data?.currentUser} />
  </svelte:fragment>
  <slot />
</AppShell>
