import React, { useState } from "react";
import type { Account } from "@planetarium/sign";
import { ImportKeyPage } from "./ImportKeyPage";
import { CreateKeyPage } from "./CreateKeyPage";

interface IndexPageProps {
  setAccount: (account: Account) => void;
}

export const IndexPage: React.FC<IndexPageProps> = ({ setAccount }) => {
  const [mode, setMode] = useState<"unknown" | "import" | "create">("unknown");

  if (mode === "create") {
    return <CreateKeyPage setAccount={setAccount} />;
  }

  if (mode === "import") {
    return <ImportKeyPage setAccount={setAccount} />;
  }

  return (
    <>
      <p>
        You don't have any key.
        <br />
        You should do some action.
      </p>
      <button
        onClick={() => setMode("create")}
        style={{
          width: "20vw",
        }}
      >
        Create a new key
      </button>
      <hr />
      <button
        onClick={() => setMode("import")}
        style={{
          width: "20vw",
        }}
      >
        Import your key
      </button>
    </>
  );
};
