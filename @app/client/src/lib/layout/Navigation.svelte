<script lang="ts">
  import { drawerStore } from "@skeletonlabs/skeleton";

  import { page } from "$app/stores";
  import Warn from "$lib/components/Warn.svelte";

  $: classesActive = (href: string) =>
    $page.url.pathname === href ? "bg-primary-active-token" : "";

  function drawerClose(): void {
    drawerStore.close();
  }

  export let currentUser: { isVerified: boolean } | null | undefined;
</script>

<div class="space-y-4 p-4 text-token">
  <nav class="list-nav">
    <ul>
      <li>
        <a
          href="/settings"
          data-cy="settingslayout-link-profile"
          on:click={drawerClose}
          class={classesActive("/settings")}
        >
          Profile
        </a>
      </li>
      <li>
        <a
          href="/settings/security"
          data-cy="settingslayout-link-password"
          on:click={drawerClose}
          class={classesActive("/settings/security")}
        >
          Passphrase
        </a>
      </li>
      <li>
        <a
          href="/settings/accounts"
          data-cy="settingslayout-link-accounts"
          on:click={drawerClose}
          class={classesActive("/settings/security")}
        >
          Linked Accounts
        </a>
      </li>
      <li>
        <a
          href="/settings/emails"
          data-cy="settingslayout-link-emails"
          on:click={drawerClose}
          class={classesActive("/settings/security")}
        >
          <Warn
            okay={!currentUser || currentUser.isVerified}
            class="-left-3 -top-1"
            data-cy="settings-unverified-warning"
          >
            <span>Emails</span>
          </Warn>
        </a>
      </li>
      <li>
        <a
          href="/settings/delete"
          data-cy="settingslayout-link-delete"
          on:click={drawerClose}
          class={classesActive("/settings/security")}
        >
          Delete Account
        </a>
      </li>
    </ul>
  </nav>
</div>
