<script lang="ts">
  import IoLogInOutline from "~icons/ion/log-in-outline";
  import IoPersonAddOutline from "~icons/ion/person-add-outline";
  import { page } from "$app/stores";
  import { isSafe } from "$lib/utils/uri";

  $: rawNext = $page.url.searchParams.get("next");
  $: next = isSafe(rawNext) ? rawNext : "/";
</script>

<div class="flex max-w-lg flex-col gap-y-2 p-2 lg:p-4">
  <a
    class="btn-base btn variant-filled-primary"
    href={`/login/email?next=${encodeURIComponent(next)}`}
    data-cy="loginpage-button-withusername"
  >
    <span class="mx-1 text-lg">
      <IoLogInOutline />
    </span>
    Sign in with E-mail or Username
  </a>
  <a
    class="btn-base btn variant-ghost-surface"
    href={`/register?next=${encodeURIComponent(next)}`}
    data-cy="loginpage-button-register"
  >
    <span class="mx-1 text-lg">
      <IoPersonAddOutline />
    </span>
    Create an account
  </a>
</div>
