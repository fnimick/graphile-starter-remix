import { ApolloClient, ApolloProvider } from "@apollo/client";
import { withApollo } from "@app/lib";
import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";

interface ClientProps {
  apollo: ApolloClient<any>;
}

function Client({ apollo }: ClientProps) {
  return (
    <ApolloProvider client={apollo}>
      <RemixBrowser />
    </ApolloProvider>
  );
}

const ClientWithApollo = withApollo(Client);

hydrate(<ClientWithApollo />, document);
