import React, { ChangeEvent, useRef, useState } from "react";
import { createAccount } from "@planetarium/account-raw";
import { Account } from "@planetarium/sign";

interface ImportKeyPageProps {
    setAccount: (account: Account) => void;
}

export const ImportKeyPage: React.FC<ImportKeyPageProps> = ({ setAccount }) => {
    const selectRef: React.LegacyRef<HTMLSelectElement> = useRef(null);
    const [accountType, setAccountType] = useState<"raw" | "json" | "unknown">("unknown");

    const inputRef: React.LegacyRef<HTMLInputElement> = useRef(null);
    
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const fileReader = new FileReader();
            fileReader.onload = e => {
                const result = e.target?.result;
                if (typeof result === "string") {
                    // setFileContent(result);
                    // getAccountFromV3(result, "aaa").then(x => deriveAddress(x)).then(x => setAddress);
                }
            };
            fileReader.readAsText(event.target.files[0], "UTF-8");
        }
    }

    if (accountType === "unknown") {
        return <div>
            <select ref={selectRef}>
                <option value="raw">Raw private key</option>
                <option value="json">Web3KeyStore json private key</option>
            </select>
            <button onClick={() => setAccountType(selectRef.current!.value as any)}>Next</button>
        </div>
    }

    if (accountType === "raw") {
        return <div>
            <input ref={inputRef} />
            <button onClick={() => setAccount(createAccount(inputRef.current?.value))}>Next</button>
        </div>
    }

    return (
        <div>
            <input type="file" onChange={onChange} />
        </div>
    )
};
