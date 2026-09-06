import { useState, useRef } from "react";
import "./App.css";

function App() {
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const resultRef = useRef(null);
  const [result, setResult] = useState(0);

  /** @param {import("react").MouseEvent<HTMLButtonElement>} e */
  function plus(e) {
    e.preventDefault();
    if (!inputRef.current) return;
    const value = Number(inputRef.current.value);
    setResult((result) => result + value);
  }

  /** @param {import("react").MouseEvent<HTMLButtonElement>} e */
  function minus(e) {
    e.preventDefault();
    if (!inputRef.current) return;
    const value = Number(inputRef.current.value);
    setResult((result) => result - value);
  }

  /** @param {import("react").MouseEvent<HTMLButtonElement>} e */
  function times(e) {
    e.preventDefault();
    if (!inputRef.current) return;
    const value = Number(inputRef.current.value);
    setResult((result) => result * value);
  }

  /** @param {import("react").MouseEvent<HTMLButtonElement>} e */
  function divide(e) {
    e.preventDefault();
    if (!inputRef.current) return;
    const value = Number(inputRef.current.value);
    setResult((result) => result / value);
  }

  /** @param {import("react").MouseEvent<HTMLButtonElement>} e */
  function resetInput(e) {
    e.preventDefault();
    if (!inputRef.current) return;
    inputRef.current.value = "0";
  }

  /** @param {import("react").MouseEvent<HTMLButtonElement>} e */
  function resetResult(e) {
    e.preventDefault();
    if (!inputRef.current) return;
    setResult(0);
  }

  return (
    <div className="App">
      <div>
        <h1>Simplest Working Calculator</h1>
      </div>
      <form>
        <p ref={resultRef}>{result}</p>
        <input
          pattern="[0-9]"
          ref={inputRef}
          type="number"
          placeholder="Type a number"
        />
        <button onClick={plus}>add</button>
        <button onClick={minus}>subtract</button>
        <button onClick={times}>multiply</button>
        <button onClick={divide}>divide</button>
        <button onClick={resetInput}>reset input</button>
        <button onClick={resetResult}>reset result</button>
      </form>
    </div>
  );
}

export default App;
