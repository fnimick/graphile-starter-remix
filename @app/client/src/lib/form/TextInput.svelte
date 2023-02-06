<script lang="ts">
  import classNames from "classnames";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { fly } from "svelte/transition";

  interface $$Props extends HTMLInputAttributes {
    name: string;
    label?: string | undefined;
    className?: string | undefined;
    error?: string | string[] | null | undefined;
  }

  export let name: string;
  export let label: string | undefined = undefined;
  export let className: string | undefined = undefined;
  export let error: string | string[] | null | undefined = undefined;
</script>

<div class="form-control">
  {#if label}
    <label class="label" for={name}>{label}</label>
  {/if}
  <input
    class={classNames([
      "input-bordered input",
      { "input-error": !!error },
      className,
    ])}
    id={name}
    {name}
    type="text"
    aria-describedby={`${name}_err`}
    {...$$restProps}
  />
  <div class="min-h-6">
    {#if error}
      <p class="mt-1 text-sm text-error" transition:fly={{ y: 5 }}>{error}</p>
    {/if}
  </div>
</div>
