<script lang="ts">
  import Alert from "$lib/components/Alert.svelte";

  import type { PageData } from "./$houdini";
  import AddEmailForm from "./AddEmailForm.svelte";
  import Email from "./Email.svelte";

  export let data: PageData;
  const { SettingsEmails } = data;
  $: user = $SettingsEmails.data?.currentUser;

  let showAddEmailForm = false;
</script>

<div class="flex w-full max-w-3xl flex-col gap-y-5">
  <h1 class="mb-4 text-center text-2xl">Email Addresses</h1>
  {#if !user?.isVerified}
    <Alert title="No verified emails" alertType="warning">
      You do not have any verified email addresses, this will make account
      recovery impossible and may limit your available functionality within this
      application. Please complete email verification.
    </Alert>
  {/if}
  <p>
    <strong>
      Account notices will be sent your primary email address.
    </strong>{" "}
    Additional email addresses may be added to help with account recovery (or to
    change your primary email), but they cannot be used until verified.
  </p>
  <div>
    {#each user?.userEmails.nodes ?? [] as email (email.id)}
      <Email
        {email}
        hasOtherEmails={(user?.userEmails.nodes.length ?? 0) > 1}
      />
    {/each}
  </div>
  {#if showAddEmailForm}
    <AddEmailForm
      on:complete={() => {
        showAddEmailForm = false;
      }}
    />
  {:else}
    <div>
      <button
        class="btn-primary btn"
        on:click={() => {
          showAddEmailForm = true;
        }}
        data-cy="settingsemails-button-addemail"
      >
        Add email
      </button>
    </div>
  {/if}
</div>
