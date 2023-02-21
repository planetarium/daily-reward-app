import type { Account } from "@planetarium/sign";
import { getAccountFromV3 } from "@planetarium/account-web";
import React, { useRef, useState } from "react";
import * as ethers from "ethers";

interface CreateKeyPageProps {
    setAccount: (account: Account) => void;
}

export const CreateKeyPage: React.FC<CreateKeyPageProps> = ({ setAccount }) => {
    const [creating, setCreating] = useState(false);
    const passwordRef: React.LegacyRef<HTMLInputElement> = useRef(null);

    const onClick = () => {
        const password = passwordRef.current?.value || "";
        ethers.Wallet.createRandom().encrypt(password)
            .then(key => setAccount(getAccountFromV3(key, password)))
            .catch(e => {
                console.error(e);
                setCreating(false);
            });
        setCreating(true);
    };

    if (creating) {
        return <>Creating a new private key...</>
    }

    return <>
        <label htmlFor="password">Password</label>
        <input ref={passwordRef} style={{ margin: "0 1em" }} id="password" type="password" />
        <button onClick={onClick}>Submit</button>
    </>
}
