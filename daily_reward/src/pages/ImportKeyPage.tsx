import React, { useRef, useState } from "react";
import { createAccount } from "@planetarium/account-raw";
import { getAccountFromV3 } from "@planetarium/account-web";
import { Account } from "@planetarium/sign";
import { AccountJsonSymbol } from "../exportable";

interface ImportKeyPageProps {
  setAccount: (account: Account) => void;
}

export const ImportKeyPage: React.FC<ImportKeyPageProps> = ({ setAccount }) => {
  const selectRef: React.LegacyRef<HTMLSelectElement> = useRef(null);
  const [accountType, setAccountType] = useState<"raw" | "json" | "unknown">(
    "unknown"
  );

  const fileRef: React.LegacyRef<HTMLInputElement> = useRef(null);
  const inputRef: React.LegacyRef<HTMLInputElement> = useRef(null);

  if (accountType === "unknown") {
    return (
      <div>
        <select ref={selectRef}>
          <option value="raw">Raw private key</option>
          <option value="json">Web3KeyStore json private key</option>
        </select>
        <button onClick={() => setAccountType(selectRef.current!.value as any)}>
          Next
        </button>
      </div>
    );
  }

  if (accountType === "raw") {
    return (
      <div>
        <input ref={inputRef} />
        <button
          onClick={() =>
            setAccount({
              ...createAccount(inputRef.current?.value),
              [AccountJsonSymbol]: inputRef.current?.value,
            })
          }
        >
          Next
        </button>
      </div>
    );
  }

  const onClick = () => {
    const password = inputRef.current?.value;
    const file = fileRef.current?.files?.item(0);

    if (!password || !file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const result = e.target?.result;
      console.log(result);
      if (typeof result === "string") {
        setAccount({
          ...getAccountFromV3(result, password),
          [AccountJsonSymbol]: result,
        });
      }
    };
    fileReader.readAsText(file, "UTF-8");
  };

  return (
    <div>
      <input type="file" ref={fileRef} />
      <input type="password" ref={inputRef} />
      <button onClick={onClick}>Next</button>
    </div>
  );
};
