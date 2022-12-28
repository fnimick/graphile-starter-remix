<script lang="ts">
  import { graphql } from "$houdini";

  import classnames from "classnames";
  import { projectName, companyName, termsAndConditionsUrl } from "@app/config";
  import { page } from "$app/stores";
  import Warn from "$lib/components/Warn.svelte";

  const limitContentWidth = true;

  const query = graphql(`
    query Shared {
      currentUser {
        id
        name
        username
        avatarUrl
        isAdmin
        isVerified
        organizationMemberships(first: 20) {
          nodes {
            id
            isOwner
            isBillingContact
            organization {
              id
              name
              slug
            }
          }
        }
      }
    }
  `);

  $: currentUser = $query.data?.currentUser;

  $: ({ pathname, search, hash } = $page.url);
  $: currentRouteURL = `${pathname}${search}${hash}`;
</script>

<div class="flex min-h-screen flex-col items-stretch">
  <div class="navbar flex-shrink-0 bg-base-100">
    <div class="navbar-start">
      <a href="/" class="btn-ghost btn text-base normal-case md:text-xl">
        {projectName}
      </a>
    </div>
    <div class="navbar-center">
      <h3 class="text-base md:text-lg">
        {#if $page.data.titleHref}
          <a href={$page.data.titleHref} data-cy="layout-header-titlelink">
            {$page.data.title}
          </a>
        {:else}
          {$page.data.title || ""}
        {/if}
      </h3>
    </div>
    <div class="navbar-end">
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
              class="placeholder btn-ghost btn-circle avatar btn"
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
            class="dropdown-content menu rounded-b-box menu-compact w-52 bg-base-100 shadow"
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
    </div>
  </div>
  <div
    class={classnames([
      "flex flex-grow flex-col items-center",
      limitContentWidth ? "w-full max-w-5xl self-center" : undefined,
    ])}
  >
    <slot />
  </div>
  <footer
    class="footer flex-shrink-0 items-center bg-neutral p-4 text-neutral-content"
  >
    <div class="grid-flow-col items-center">
      <p>
        Copyright &copy; {new Date().getFullYear()}
        {companyName}. All rights reserved.
        <span>
          {" "}
          <a
            class="underline"
            href={termsAndConditionsUrl}
            target="_blank"
            rel="noreferrer"
          >
            Terms and conditions
          </a>
        </span>
      </p>
    </div>
    <div class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
      <p>
        Powered by{" "}
        <a
          class="underline"
          href="https://graphile.org/postgraphile"
          target="_blank"
          rel="noreferrer"
        >
          PostGraphile
        </a>
      </p>
      <a href="https://twitter.com" target="_blank" rel="noreferrer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="fill-current"
        >
          <path
            d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
          />
        </svg>
      </a>
      <a href="https://youtube.com" target="_blank" rel="noreferrer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="fill-current"
        >
          <path
            d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
          />
        </svg>
      </a>
      <a
        href="https://www.nateliason.com/blog/delete-facebook"
        target="_blank"
        rel="noreferrer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          class="fill-current"
        >
          <path
            d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
          />
        </svg>
      </a>
    </div>
  </footer>
</div>
