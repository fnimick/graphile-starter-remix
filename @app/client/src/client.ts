import { error } from "@sveltejs/kit";

import { PUBLIC_ROOT_URL } from "$env/static/public";
import { HoudiniClient } from "$houdini";

export default new HoudiniClient({
  url: `${PUBLIC_ROOT_URL}/graphql`,
  throwOnError: {
    operations: ["all"],
    error: (errors) => {
      // Return the first graphql error unaffected - this is necessary for
      // getCodeFromError to work.
      return errors[0];
    },
  },
});
