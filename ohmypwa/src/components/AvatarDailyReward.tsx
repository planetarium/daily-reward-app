import { Account, deriveAddress, signTransaction } from "@planetarium/sign";
import { encodeUnsignedTxWithCustomActions } from "@planetarium/tx";
import { encode } from "bencodex";
import React from "react";
import { useStageTransactionMutation } from "../generated/graphql";

interface AvatarDailyRewardProps {
    dailyRewardReceivedIndex: number,
    address: string,
    tip: number,
    actionPoint: number,
    account: Account,
    nonce: number,
}

async function makeDailyRewardTransaction(account: Account, nonce: bigint, avatarAddress: Uint8Array): Promise<string> {
    return await signTransaction(
        encode(encodeUnsignedTxWithCustomActions({
            nonce,
            signer: Buffer.from((await deriveAddress(account)).substring(2), "hex"),
            publicKey: await account.getPublicKey(),
            genesisHash: Buffer.from("4582250d0da33b06779a8475d283d5dd210c683b9b999d74d03fac4f58fa6bce", "hex"),
            customActions: [
                {
                    type_id: "daily_reward6",
                    values: {
                        id: Buffer.from("63c4180d1d914527a1dc4def13fe1fab", "hex"),
                        a: avatarAddress,
                    },
                },
            ],
            updatedAddresses: new Set([]),
            timestamp: new Date(),
        })).toString("hex"),
        account
    );
}

export const AvatarDailyReward: React.FC<AvatarDailyRewardProps> = ({ dailyRewardReceivedIndex, address, tip, actionPoint, account, nonce }) => {
    const [stageTransaction, { data, loading, error }] = useStageTransactionMutation();

    const blocksToWait = dailyRewardReceivedIndex + 1700 - tip;

    let claimable: boolean = false;
    if (blocksToWait <= 0) {
        claimable = true;
    }

    return <div style={{
        border: "solid gray 1px",
        padding: "1em"
    }}>
        <p>Address: {address}</p>
        <p>Remained action points: {actionPoint}</p>
        {claimable ? <button onClick={() => makeDailyRewardTransaction(account, BigInt(nonce), Buffer.from(address.substring(2), "hex")).then(x => stageTransaction({
            variables: {
                transaction: x,
            }
        }))}>Claim</button> : <p>Wait for {blocksToWait} blocks.</p>}
    </div>
}
