import type { HandleFetch } from "@sveltejs/kit";

import { PUBLIC_ROOT_URL } from "$env/static/public";

export const handleFetch: HandleFetch = ({ event, request, fetch }) => {
  if (request.url.startsWith(PUBLIC_ROOT_URL)) {
    const cookie = event.request.headers.get("cookie");
    if (cookie) {
      request.headers.set("cookie", cookie);
    }
  }

  return fetch(request);
};
