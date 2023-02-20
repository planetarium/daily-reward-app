import { useEffect, useState } from "react";
import "./App.css";
import { deriveAddress, Account } from "@planetarium/sign";
import { ImportKeyPage } from "./pages/ImportKeyPage";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import { DailyRewardPage } from "./pages/DailyRewardPage";

const client = new ApolloClient({
  uri: "https://9c-main-full-state.planetarium.dev/graphql",
  cache: new InMemoryCache(),
});

function App() {
  const [account, setAccount] = useState<Account | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (account === null) {
      return;
    }

    deriveAddress(account).then(setAddress);

    return () => setAddress(null);
  }, [account]);

  if (account === null) {
    return <ImportKeyPage setAccount={setAccount} />;
  }

  if (address === null) {
    return <p>Loading address...</p>;
  }

  return (
    <ApolloProvider client={client}>
      <DailyRewardPage account={account} address={address} />
    </ApolloProvider>
  );
}

export default App;
