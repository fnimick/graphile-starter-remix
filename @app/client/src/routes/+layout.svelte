<script lang="ts">
  import "@skeletonlabs/skeleton/themes/theme-skeleton.css";
  import "@skeletonlabs/skeleton/styles/all.css";
  import "../app.postcss";

  // Floating UI for Popups
  import {
    arrow,
    autoUpdate,
    computePosition,
    flip,
    offset,
    shift,
  } from "@floating-ui/dom";
  import { storePopup } from "@skeletonlabs/skeleton";

  import { browser } from "$app/environment";

  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

{#if browser}
  <div hidden id="sveltekit-hydrated" />
{/if}

<slot />
