<script lang="ts" context="module">
  export const ZXCVBN_SCORE_REQUIREMENT = 2;
</script>

<script lang="ts">
  import { popup, ProgressBar } from "@skeletonlabs/skeleton";
  import zxcvbn from "zxcvbn";

  import IonInformationCircleOutline from "~icons/ion/information-circle-outline";

  function calculatePasswordStrength(password: string) {
    const { score, feedback } = zxcvbn(password || "");

    const messages = [...feedback.suggestions];
    if (feedback.warning !== "") {
      messages.push(feedback.warning);
    }
    return { score, messages };
  }

  export let passwordText: string;
  export let isDirty: boolean;

  let score = 0;
  let messages: string[] = [];

  $: ({ score, messages } = calculatePasswordStrength(passwordText));
</script>

<div class="flex flex-row items-center justify-between">
  <div class="basis-3/4">
    <ProgressBar
      label="Password Strength"
      value={score + 1}
      max={5}
      meter={score < ZXCVBN_SCORE_REQUIREMENT
        ? "bg-error-500"
        : "bg-success-500"}
      class={isDirty && passwordText !== "" ? "visible" : "invisible"}
    />
  </div>
  <div
    class="card variant-filled-warning z-[999] whitespace-nowrap p-2"
    data-popup="passwordSuggestionTooltip"
  >
    <div class="card-body">
      <h2 class="card-title">Passphrase Suggestions</h2>
      <ul class="list-inside list-disc">
        {#each messages as message}
          <li>{message}</li>
        {/each}
      </ul>
    </div>
    <!-- Arrow -->
    <div class="arrow variant-filled-warning" />
  </div>
  <span
    use:popup={{
      event: "hover",
      target: "passwordSuggestionTooltip",
      placement: "bottom",
    }}
    class={isDirty && passwordText !== "" && messages.length > 0
      ? "visible"
      : "invisible"}
  >
    <IonInformationCircleOutline />
  </span>
</div>
