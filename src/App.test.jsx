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

test("preserves the existing zero-divisor behavior", () => {
  const { result, input, click } = calculator();
  fireEvent.change(input, { target: { value: "5" } });
  click("add");
  fireEvent.change(input, { target: { value: "0" } });
  click("divide");
  expect(result).toHaveTextContent(/^Infinity$/);
});
