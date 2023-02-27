import { createClient } from "graphql-ws";

import { PUBLIC_ROOT_URL } from "$env/static/public";
import { HoudiniClient, subscription } from "$houdini";

const websocketUrl = `${PUBLIC_ROOT_URL.replace(/^http/, "ws")}/graphql`;

export default new HoudiniClient({
  url: `${PUBLIC_ROOT_URL}/graphql`,
  fetchParams: () => ({
    credentials: "include",
  }),
  throwOnError: {
    operations: ["all"],
    error: (errors) => {
      // Return the first graphql error unchanged - this is necessary for
      // getCodeFromError to work.
      return errors[0];
    },
  },
  plugins: [subscription(() => createClient({ url: websocketUrl }))],
});
