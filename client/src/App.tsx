import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { useBlockNumber } from "wagmi";
import { ConnectKitButton } from "connectkit";
function App() {
  const result = useBlockNumber();
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <ConnectKitButton />
      <h2>Block Number</h2>
      {result.data?.toString()}
    </>
  );
}

export default App;
