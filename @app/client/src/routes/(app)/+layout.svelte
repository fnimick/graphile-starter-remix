<script lang="ts">
  import { companyName, projectName, termsAndConditionsUrl } from "@app/config";
  import { AppBar, AppShell } from "@skeletonlabs/skeleton";
  import classnames from "classnames";

  import IonLogoFacebook from "~icons/ion/logo-facebook";
  import IonLogoTwitter from "~icons/ion/logo-twitter";
  import IonLogoYoutube from "~icons/ion/logo-youtube";
  import { page } from "$app/stores";
  import Warn from "$lib/components/Warn.svelte";

  import type { PageData } from "./$houdini";

  const limitContentWidth = true;

  export let data: PageData;
  $: currentUser = data.currentUser;

  $: ({ pathname, search, hash } = $page.url);
  $: currentRouteURL = `${pathname}${search}${hash}`;
</script>

<AppShell slotPageContent="flex flex-col">
  <svelte:fragment slot="header">
    <AppBar slotDefault="text-center">
      <a slot="lead" href="/" class="btn">{projectName}</a>
      <slot name="page-title" />
      <svelte:fragment slot="trail">
        {#if currentUser != null}
          <div class="dropdown-end dropdown" data-cy="layout-dropdown-user">
            <Warn
              okay={currentUser.isVerified}
              className="right-2 top-2"
              data-cy="header-unverified-warning"
            >
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label
                tabIndex={0}
                class="btn-ghost btn-circle avatar btn placeholder"
              >
                <div class="full w-10 rounded">
                  <span>
                    {currentUser.name
                      ?.split(" ")
                      .map((part) => part.charAt(0).toUpperCase())
                      .slice(0, 3) // max 3 initials
                      .join("")}
                  </span>
                </div>
              </label>
            </Warn>
            <ul
              tabIndex={0}
              class="dropdown-content menu rounded-b-box menu-compact bg-base-100 w-52 shadow"
            >
              <li>
                <a
                  href="/settings"
                  data-cy="layout-link-settings"
                  on:click={(e) => e.currentTarget.blur()}
                >
                  <Warn okay={currentUser.isVerified}>
                    <span class="mr-2">Profile</span>
                  </Warn>
                </a>
              </li>
              <li>
                <a href="/report" on:click={(e) => e.currentTarget.blur()}>
                  Report Template
                </a>
              </li>
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <form
                method="post"
                action="/logout"
                on:click={(e) => e.currentTarget.blur()}
              >
                <!-- <AuthenticityTokenInput /> -->
                <li>
                  <button class="button-link" type="submit">Logout</button>
                </li>
              </form>
            </ul>
          </div>
        {:else if !$page.data.hideLogin}
          <a
            href={`/login?next=${encodeURIComponent(currentRouteURL)}`}
            data-cy="header-login-button"
          >
            Sign in
          </a>
        {/if}
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <div
    class={classnames([
      "flex flex-grow flex-col items-center p-2 lg:p-4",
      limitContentWidth ? "w-full max-w-5xl self-center" : undefined,
    ])}
  >
    <slot />
  </div>

  <svelte:fragment slot="pageFooter">
    <footer
      class="page-footer grid grid-flow-row-dense grid-cols-1 text-xs bg-surface-100-800-token md:p-10 md:text-base lg:grid-cols-3"
    >
      <div class="col-span-2 flex items-center justify-center lg:justify-start">
        <p>
          Copyright &copy; {new Date().getFullYear()}
          {companyName}. All rights reserved.
          <span>
            {" "}
            <a href={termsAndConditionsUrl} target="_blank" rel="noreferrer">
              Terms and conditions
            </a>
          </span>
        </p>
      </div>
      <div
        class="flex flex-row items-center justify-center gap-2 lg:justify-end"
      >
        <p>
          Powered by{" "}
          <a
            href="https://graphile.org/postgraphile"
            target="_blank"
            rel="noreferrer"
          >
            PostGraphile
          </a>
        </p>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noreferrer"
          class="unstyled"
        >
          <IonLogoTwitter />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noreferrer"
          class="unstyled"
        >
          <IonLogoYoutube />
        </a>
        <a
          href="https://www.nateliason.com/blog/delete-facebook"
          target="_blank"
          rel="noreferrer"
          class="unstyled"
        >
          <IonLogoFacebook />
        </a>
      </div>
    </footer>
  </svelte:fragment>
</AppShell>
