import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";

function calculator() {
  const { container } = render(<App />);
  return {
    input: screen.getByRole("spinbutton"),
    result: container.querySelector("form > p"),
    click: (name) => fireEvent.click(screen.getByRole("button", { name, exact: true })),
  };
}

test("renders the calculator and starts at zero", () => {
  const { result, input } = calculator();
  expect(screen.getByRole("heading", { name: "Simplest Working Calculator" })).toBeInTheDocument();
  expect(result).toHaveTextContent(/^0$/);
  expect(input).toHaveValue(null);
});

test("adds and subtracts cumulatively without submitting the form", () => {
  const { result, input, click } = calculator();
  fireEvent.change(input, { target: { value: "10" } });
  expect(click("add")).toBe(false);
  click("add");
  expect(result).toHaveTextContent(/^20$/);
  fireEvent.change(input, { target: { value: "3" } });
  expect(click("subtract")).toBe(false);
  expect(result).toHaveTextContent(/^17$/);
});

test("multiplies and divides the accumulated result", () => {
  const { result, input, click } = calculator();
  fireEvent.change(input, { target: { value: "6" } });
  click("add");
  fireEvent.change(input, { target: { value: "4" } });
  expect(click("multiply")).toBe(false);
  expect(result).toHaveTextContent(/^24$/);
  fireEvent.change(input, { target: { value: "3" } });
  expect(click("divide")).toBe(false);
  expect(result).toHaveTextContent(/^8$/);
});

test("accepts negative and decimal input through the visible controls", async () => {
  const user = userEvent.setup();
  const { result, input } = calculator();
  await user.type(input, "-2.5");
  await user.click(screen.getByRole("button", { name: "add", exact: true }));
  expect(result).toHaveTextContent(/^-2.5$/);
});

test("resets the input to zero while retaining the result", () => {
  const { result, input, click } = calculator();
  fireEvent.change(input, { target: { value: "7" } });
  click("add");
  expect(click("reset input")).toBe(false);
  expect(input).toHaveValue(0);
  expect(result).toHaveTextContent(/^7$/);
});

test("resets the result while retaining the input", () => {
  const { result, input, click } = calculator();
  fireEvent.change(input, { target: { value: "7" } });
  click("add");
  expect(click("reset result")).toBe(false);
  expect(input).toHaveValue(7);
  expect(result).toHaveTextContent(/^0$/);
});

test.each([["5", "0"], ["0", "0"], ["5", "-0"]])("reports division of %s by %s while retaining the last valid result", (initial, divisor) => {
  const { result, input, click } = calculator();
  fireEvent.change(input, { target: { value: initial } });
  click("add");
  fireEvent.change(input, { target: { value: divisor } });
  click("divide");
  expect(result.textContent).toBe(initial);
  expect(screen.getByRole("alert")).toHaveTextContent("Cannot divide by zero.");
  expect(input).toHaveAccessibleDescription("Cannot divide by zero.");
  expect(input).toHaveAttribute("aria-invalid", "true");
});

test("a valid operation clears an error and continues from the last valid result", () => {
  const { result, input, click } = calculator();
  fireEvent.change(input, { target: { value: "5" } });
  click("add");
  fireEvent.change(input, { target: { value: "0" } });
  click("divide");
  fireEvent.change(input, { target: { value: "2" } });
  click("divide");
  expect(result).toHaveTextContent(/^2.5$/);
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(input).not.toHaveAttribute("aria-describedby");
  expect(input).not.toHaveAttribute("aria-invalid", "true");
});

test.each(["reset input", "reset result"])("%s clears an error and retains its original reset behavior", reset => {
  const { result, input, click } = calculator();
  fireEvent.change(input, { target: { value: "7" } });
  click("add");
  fireEvent.change(input, { target: { value: "0" } });
  click("divide");
  expect(screen.getByRole("alert")).toBeInTheDocument();
  click(reset);
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(result.textContent).toBe(reset === "reset result" ? "0" : "7");
  expect(input).toHaveValue(0);
});

test.each(["add", "subtract", "multiply", "divide"])("%s rejects an empty operand without changing the result", operation => {
  const { result, input, click } = calculator();
  fireEvent.change(input, { target: { value: "7" } });
  click("add");
  fireEvent.change(input, { target: { value: "" } });
  click(operation);
  expect(result).toHaveTextContent(/^7$/);
  expect(screen.getByRole("alert")).toHaveTextContent("Enter a finite number.");
});

test.each(["1e309", "not a number"])("rejects the browser's invalid number entry %s", value => {
  const { result, input, click } = calculator();
  fireEvent.change(input, { target: { value } });
  click("add");
  expect(result).toHaveTextContent(/^0$/);
  expect(screen.getByRole("alert")).toHaveTextContent("Enter a finite number.");
});

test.each([
  ["1e308", "1e308", "add"],
  ["-1e308", "1e308", "subtract"],
  ["1e308", "2", "multiply"],
  ["1", "1e-309", "divide"],
])("retains %s when %s would overflow through %s", (initial, operand, operation) => {
  const { result, input, click } = calculator();
  fireEvent.change(input, { target: { value: initial } });
  click("add");
  const previous = result.textContent;
  fireEvent.change(input, { target: { value: operand } });
  click(operation);
  expect(result.textContent).toBe(previous);
  expect(screen.getByRole("alert")).toHaveTextContent("Result is too large. Try a smaller number.");
});

test("continues to accept finite scientific notation and very small results", () => {
  const { result, input, click } = calculator();
  fireEvent.change(input, { target: { value: "1" } });
  click("add");
  fireEvent.change(input, { target: { value: "1e308" } });
  click("divide");
  expect(result).toHaveTextContent(/^1e-308$/);
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(input).not.toHaveAttribute("pattern");
});
