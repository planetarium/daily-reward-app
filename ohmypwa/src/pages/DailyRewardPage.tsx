import React, { ChangeEvent, useRef, useState } from "react";
import { createAccount } from "@planetarium/account-raw";
import { Account } from "@planetarium/sign";
import { useLoadStateQuery } from "../generated/graphql";
import { AvatarDailyReward } from "../components/AvatarDailyReward";

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

  return (
    <div>
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
