import { load_SettingsEmails } from "$houdini";

import type { PageLoadEvent } from "./$types";

export async function load(event: PageLoadEvent) {
  return { pageTitle: "Emails", ...(await load_SettingsEmails({ event })) };
}
