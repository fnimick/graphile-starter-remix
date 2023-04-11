<script lang="ts">
  import IonMailOutline from "~icons/ion/mail-outline";
  import { enhance } from "$app/forms";
  import type { EmailsForm_UserEmail } from "$houdini";
  import { fragment, graphql } from "$houdini";

  export let email: EmailsForm_UserEmail;
  export let hasOtherEmails: boolean;

  $: frag = fragment(
    email,
    graphql(`
      fragment EmailsForm_UserEmail on UserEmail {
        id
        email
        isVerified
        isPrimary
        createdAt
      }
    `)
  );

  $: canDelete = !$frag?.isPrimary && hasOtherEmails;
</script>

<div
  data-cy={`settingsemails-emailitem-${$frag?.email.replace(
    /[^a-zA-Z0-9]/g,
    "-"
  )}`}
  class="border-base-content/60 flex flex-row items-center gap-x-3 border-b py-3"
>
  <div class="flex-shrink-0 text-2xl">
    <IonMailOutline />
  </div>
  <div class="flex-grow">
    <p>
      {$frag?.email}{" "}
      <span
        title={$frag?.isVerified
          ? "Verified"
          : "Pending verification (please check your inbox / spam folder"}
      >
        {" "}
        {#if $frag?.isVerified}
          ✅
        {:else}
          <small class="text-error">(unverified)</small>
        {/if}
      </span>
    </p>
    <p class="text-base-content/70">
      Added {$frag?.createdAt.toLocaleString()}
    </p>
  </div>
  {#if $frag?.isPrimary}
    <span
      data-cy="settingsemails-indicator-primary"
      class="text-base-content/70"
    >
      Primary
    </span>
  {/if}
  {#if canDelete}
    <form class="inline" method="post" action="?/delete" use:enhance>
      <input type="hidden" name="emailId" value={$frag?.id} />
      <button
        type="submit"
        data-cy="settingsemails-button-delete"
        class="text-primary-700 dark:text-primary-500 underline hover:brightness-110"
      >
        Delete
      </button>
    </form>
  {/if}
  {#if !$frag?.isVerified}
    <form
      class="inline"
      method="post"
      action="?/resend_verification"
      use:enhance
    >
      <input type="hidden" name="emailId" value={$frag?.id} />
      <button
        type="submit"
        class="text-primary-700 dark:text-primary-500 underline hover:brightness-110"
      >
        Resend verification
      </button>
    </form>
  {/if}
  {#if $frag?.isVerified && !$frag?.isPrimary}
    <form class="inline" method="post" action="?/make_primary" use:enhance>
      <input type="hidden" name="emailId" value={$frag?.id} />
      <button
        type="submit"
        data-cy="settingsemails-button-makeprimary"
        class="text-primary-700 dark:text-primary-500 underline hover:brightness-110"
      >
        Make primary
      </button>
    </form>
  {/if}
</div>
