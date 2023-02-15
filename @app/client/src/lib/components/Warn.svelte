<script lang="ts">
  import classNames from "classnames";

  export let okay: boolean;
  let className: string | undefined = undefined;
  export { className as class };
  export let pulse = false;

  const defaultClassname =
    "badge-icon variant-filled-error absolute z-10 h-3 w-3";
</script>

<div>
  {#if !okay}
    {#if pulse}
      <span
        class={classNames(defaultClassname, "animate-ping", className)}
        {...$$restProps}
      />
    {/if}
    <span class={classNames(defaultClassname, className)} {...$$restProps} />
  {/if}
  <slot />
</div>
