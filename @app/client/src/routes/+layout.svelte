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

  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<slot />
