import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import EmpCrud from "./empCrud";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <EmpCrud />
    </>
  );
}

export default App;
