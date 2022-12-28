<script lang="ts">
  import classNames from "classnames";

  export let okay: boolean;
  export let className: string | undefined = undefined;
</script>

<div class="indicator">
  {#if !okay}
    <span
      class={classNames(
        "badge-secondary badge badge-xs indicator-item",
        className
      )}
      {...$$restProps}
    />
  {/if}
  <slot />
</div>
