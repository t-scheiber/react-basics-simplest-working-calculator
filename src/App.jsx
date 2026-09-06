import { useState, useRef } from "react";
import "./App.css";

function App() {
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const [result, setResult] = useState(0);
  const [error, setError] = useState("");

  /**
   * @param {import("react").MouseEvent<HTMLButtonElement>} e
   * @param {"add" | "subtract" | "multiply" | "divide"} operation
   */
  function calculate(e, operation) {
    e.preventDefault();
    if (!inputRef.current) return;
    const value = inputRef.current.valueAsNumber;
    if (!Number.isFinite(value)) {
      setError("Enter a finite number.");
      return;
    }
    if (operation === "divide" && value === 0) {
      setError("Cannot divide by zero.");
      return;
    }
    let next;
    switch (operation) {
      case "add": next = result + value; break;
      case "subtract": next = result - value; break;
      case "multiply": next = result * value; break;
      case "divide": next = result / value; break;
    }
    if (!Number.isFinite(next)) {
      setError("Result is too large. Try a smaller number.");
      return;
    }
    setResult(next);
    setError("");
  }

  /** @param {import("react").MouseEvent<HTMLButtonElement>} e */
  function resetInput(e) {
    e.preventDefault();
    if (!inputRef.current) return;
    inputRef.current.value = "0";
    setError("");
  }

  /** @param {import("react").MouseEvent<HTMLButtonElement>} e */
  function resetResult(e) {
    e.preventDefault();
    setResult(0);
    setError("");
  }

  return (
    <div className="App">
      <div>
        <h1>Simplest Working Calculator</h1>
      </div>
      <form>
        <p aria-live="polite" aria-label="Result">{result}</p>
        <input
          ref={inputRef}
          type="number"
          step="any"
          aria-label="Number"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "calculator-error" : undefined}
          placeholder="Type a number"
        />
        {error && <p id="calculator-error" role="alert">{error}</p>}
        <button onClick={(e) => calculate(e, "add")}>add</button>
        <button onClick={(e) => calculate(e, "subtract")}>subtract</button>
        <button onClick={(e) => calculate(e, "multiply")}>multiply</button>
        <button onClick={(e) => calculate(e, "divide")}>divide</button>
        <button onClick={resetInput}>reset input</button>
        <button onClick={resetResult}>reset result</button>
      </form>
    </div>
  );
}

export default App;
