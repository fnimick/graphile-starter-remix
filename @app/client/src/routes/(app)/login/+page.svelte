<script lang="ts">
  import IoLogInOutline from "virtual:icons/ion/log-in-outline";
  import IoPersonAddOutline from "virtual:icons/ion/person-add-outline";

  import { page } from "$app/stores";
  import { isSafe } from "$lib/utils/uri";

  $: rawNext = $page.url.searchParams.get("next");
  $: next = isSafe(rawNext) ? rawNext : "/";
</script>

<div class="flex max-w-lg flex-col gap-y-2">
  <a
    class="btn-primary btn"
    href={`email?next=${encodeURIComponent(next)}`}
    data-cy="loginpage-button-withusername"
  >
    <span class="mx-1 text-lg">
      <IoLogInOutline />
    </span>
    Sign in with E-mail or Username
  </a>
  <a
    class="btn-outline btn-ghost btn"
    href={`/register?next=${encodeURIComponent(next)}`}
    data-cy="loginpage-button-register"
  >
    <span class="mx-1 text-lg">
      <IoPersonAddOutline />
    </span>
    Create an account
  </a>
</div>
