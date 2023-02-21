import React from "react";
import { Account } from "@planetarium/sign";
import { useLoadStateQuery } from "../generated/graphql";
import { AvatarDailyReward } from "../components/AvatarDailyReward";
import { AccountJsonSymbol } from "../exportable";

interface DailyRewardPageProps {
  account: Account;
  address: string;
}

export const DailyRewardPage: React.FC<DailyRewardPageProps> = ({
  account,
  address,
}) => {
  const { data, loading, refetch } = useLoadStateQuery({
    variables: {
      address,
    },
    pollInterval: 5000,
  });

  if (loading || !data || !data.chainQuery.blockQuery?.block?.index) {
    return <p>Loading data...</p>;
  }

  const tip = data.chainQuery.blockQuery.block.index;
  const nonce = data.transaction.nextTxNonce;

  const exportButton = Object.hasOwn(account, AccountJsonSymbol) ? (
    <a
      href={
        "data:data:attachment/text," +
        encodeURI(
          Object.getOwnPropertyDescriptor(account, AccountJsonSymbol)?.value
        )
      }
      target="_blank"
      download="key.json"
      title="This account type is able to export."
    >
      Export Key
    </a>
  ) : null;

  return (
    <div>
      {exportButton}
      <h3>Current tip</h3>
      <p>{tip}</p>
      <h3>Agent Address</h3>
      <p>{address}</p>
      <h3>Avatars</h3>
      {data.stateQuery.agent?.avatarStates?.map((x) => (
        <AvatarDailyReward
          key={x.address}
          {...x}
          tip={tip}
          nonce={nonce}
          account={account}
        />
      ))}
    </div>
  );
};
