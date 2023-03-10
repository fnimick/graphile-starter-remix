<script lang="ts">
  import { companyName, projectName, termsAndConditionsUrl } from "@app/config";
  import { AppBar, AppShell, Avatar, popup } from "@skeletonlabs/skeleton";
  import classnames from "classnames";

  import IonLogoFacebook from "~icons/ion/logo-facebook";
  import IonLogoTwitter from "~icons/ion/logo-twitter";
  import IonLogoYoutube from "~icons/ion/logo-youtube";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { CurrentUserUpdatedStore } from "$houdini";
  import Warn from "$lib/components/Warn.svelte";

  import type { PageData } from "./$houdini";

  export let data: PageData;

  $: ({ pathname, search, hash } = $page.url);
  $: currentRouteURL = `${pathname}${search}${hash}`;

  $: pageTitle = $page.data.pageTitle ?? "";

  $: currentUserUpdated =
    browser && data.currentUser != null
      ? new CurrentUserUpdatedStore()
      : undefined;
  // eslint-disable-next-line no-unused-expressions
  $: currentUserUpdated && currentUserUpdated.listen();
  $: currentUser =
    $currentUserUpdated?.data?.currentUserUpdated?.user ?? data.currentUser;
</script>

<AppShell slotPageContent="flex flex-col">
  <svelte:fragment slot="pageHeader">
    <AppBar
      gridColumns="grid-cols-3"
      slotDefault="place-self-center"
      slotTrail="place-content-end"
    >
      <a slot="lead" href="/" class="btn">{projectName}</a>
      <h3>{pageTitle}</h3>
      <svelte:fragment slot="trail">
        {#if currentUser != null}
          <span class="relative">
            <Warn
              okay={currentUser.isVerified}
              data-cy="header-unverified-warning"
            >
              <span
                use:popup={{
                  target: "profileMenu",
                  event: "click",
                  placement: "bottom",
                }}
                class="cursor-pointer"
              >
                <Avatar
                  initials={currentUser.name
                    ?.split(" ")
                    .map((part) => part.charAt(0).toUpperCase())
                    .slice(0, 3) // max 3 initials
                    .join("")}
                  background="bg-primary-500"
                />
              </span>
              <nav
                class="card list-nav w-60 p-4 shadow-xl"
                data-popup="profileMenu"
              >
                <ul>
                  <li>
                    <Warn okay={currentUser.isVerified} pulse>
                      <a href="/settings" data-cy="layout-link-settings">
                        <span class="">Profile</span>
                      </a>
                    </Warn>
                    <!-- <a href="/settings" data-cy="layout-link-settings">
                  <span class="">Profile</span>
                </a> -->
                  </li>
                  <li>
                    <form method="post" action="/logout">
                      <!-- <AuthenticityTokenInput /> -->
                      <button class="w-full" type="submit">Logout</button>
                    </form>
                  </li>
                </ul>
              </nav>
            </Warn>
          </span>
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

  <div class={classnames(["flex flex-grow flex-col items-center"])}>
    <slot />
  </div>

  <svelte:fragment slot="pageFooter">
    <footer
      class="page-footer grid grid-flow-row-dense grid-cols-1 text-xs bg-surface-100-800-token md:p-10 md:text-base lg:grid-cols-3"
    >
      <div
        class="col-span-2 flex items-center justify-center text-center lg:justify-start"
      >
        <p>
          Copyright &copy; {new Date().getFullYear()}
          {companyName}. All rights reserved.
          <span>
            {" "}
            <a href={termsAndConditionsUrl} target="_blank" rel="noreferrer">
              Terms and conditions.
            </a>
          </span>
        </p>
      </div>
      <div
        class="flex flex-row items-center justify-center gap-2 text-center lg:justify-end"
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
