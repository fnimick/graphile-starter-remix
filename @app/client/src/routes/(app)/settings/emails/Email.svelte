<script lang="ts">
  import IonMailOutline from "~icons/ion/mail-outline";
  import { enhance } from "$app/forms";
  import type { EmailsForm_UserEmail$data } from "$houdini";

  export let email: EmailsForm_UserEmail$data;
  export let hasOtherEmails: boolean;

  $: canDelete = !email.isPrimary && hasOtherEmails;
</script>

<div
  data-cy={`settingsemails-emailitem-${email.email.replace(
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
      {email.email}{" "}
      <span
        title={email.isVerified
          ? "Verified"
          : "Pending verification (please check your inbox / spam folder"}
      >
        {" "}
        {#if email.isVerified}
          ✅
        {:else}
          <small class="text-error">(unverified)</small>
        {/if}
      </span>
    </p>
    <p class="text-base-content/70">
      Added {new Date(email.createdAt).toLocaleString()}
    </p>
  </div>
  {#if email.isPrimary}
    <span
      data-cy="settingsemails-indicator-primary"
      class="text-base-content/70"
    >
      Primary
    </span>
  {/if}
  {#if canDelete}
    <form class="inline" method="post" action="?/delete" use:enhance>
      <input type="hidden" name="emailId" value={email.id} />
      <button
        type="submit"
        data-cy="settingsemails-button-delete"
        class="text-primary-700 underline hover:brightness-110 dark:text-primary-500"
      >
        Delete
      </button>
    </form>
  {/if}
  {#if !email.isVerified}
    <form
      class="inline"
      method="post"
      action="?/resend_verification"
      use:enhance
    >
      <input type="hidden" name="emailId" value={email.id} />
      <button
        type="submit"
        class="text-primary-700 underline hover:brightness-110 dark:text-primary-500"
      >
        Resend verification
      </button>
    </form>
  {/if}
  {#if email.isVerified && !email.isPrimary}
    <form class="inline" method="post" action="?/make_primary" use:enhance>
      <input type="hidden" name="emailId" value={email.id} />
      <button
        type="submit"
        data-cy="settingsemails-button-makeprimary"
        class="text-primary-700 underline hover:brightness-110 dark:text-primary-500"
      >
        Make primary
      </button>
    </form>
  {/if}
</div>
