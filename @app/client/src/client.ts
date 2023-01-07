import { PUBLIC_ROOT_URL } from "$env/static/public";
import { type RequestHandler, HoudiniClient } from "$houdini";

const requestHandler: RequestHandler = async ({
  fetch,
  text = "",
  variables = {},
  // metadata,
}) => {
  const url = `${PUBLIC_ROOT_URL}/graphql`;
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  });
  return await result.json();
};

export default new HoudiniClient(requestHandler);
