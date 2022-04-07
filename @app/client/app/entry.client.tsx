import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";

function Client() {
  return <RemixBrowser />;
}

hydrate(<Client />, document);
