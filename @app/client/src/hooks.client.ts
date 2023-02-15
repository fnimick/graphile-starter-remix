import type { HandleClientError } from "@sveltejs/kit";

export const handleError: HandleClientError = async ({ event, error }) => {
  console.error("handleError client");
  console.error(error);
};
