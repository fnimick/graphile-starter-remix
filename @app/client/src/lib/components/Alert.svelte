<script lang="ts" context="module">
  export type AlertType = "warning" | "error" | "success";
</script>

<script lang="ts">
  import classNames from "classnames";

  import IonAlertCircleOutline from "~icons/ion/alert-circle-outline";
  import IonCheckmarkCircleOutline from "~icons/ion/checkmark-circle-outline";
  import IonCloseCircleOutline from "~icons/ion/close-circle-outline";

  export let alertType: AlertType | undefined = undefined;
  export let className: string | undefined = undefined;
  export let icon: typeof IonCloseCircleOutline | undefined = undefined;
  export let title: string | undefined = undefined;
  export let message: string;
  export let code: string | undefined | null = undefined;

  let renderIcon: typeof IonCloseCircleOutline | undefined = icon;
  let renderClassname: string | undefined = className;

  if (alertType === "error") {
    renderIcon = IonCloseCircleOutline;
    renderClassname = "alert-error";
  }
  if (alertType === "warning") {
    renderIcon = IonAlertCircleOutline;
    renderClassname = "alert-warning";
  }
  if (alertType === "success") {
    renderIcon = IonCheckmarkCircleOutline;
    renderClassname = "alert-success";
  }
</script>

<div class={classNames("alert", renderClassname)}>
  <div>
    {#if renderIcon}
      <span class="text-2xl">
        <svelte:component this={renderIcon} />
      </span>
    {/if}
    <div>
      {#if title}
        <h1 class="text-xl font-bold">{title}</h1>
      {/if}
      <div>
        <slot />
        {message}
        {#if code}
          <span>(Error code: <code>ERR_{code}</code>)</span>
        {/if}
      </div>
    </div>
  </div>
</div>
