# Simplest Working Calculator
A React calculator built as an exercise in the React Basics course of the Meta Front-End Developer certificate on Coursera, taken in 2023 and 2024.

The app keeps a running result. Type a number, then press add, subtract, multiply or divide to combine it with the result. The result starts at 0. For example, a result of 10 and a number of 3 become 30 after multiply.

## What it does

- Add, subtract, multiply and divide each apply the number field to the running result.
- "reset input" sets the number field to 0. "reset result" sets the running result to 0. Each reset keeps the other value.
- Negative numbers and decimals work. Scientific notation such as `1e3` works when the value is finite.
- An empty field, a zero divisor or an overflow to Infinity shows an error message and keeps the last valid result. A valid operation or either reset clears the message.

All state lives in `src/App.jsx`: a `result` number, an `error` string and a ref to the input element.

## Stack

- React 19.3.1, written in JSX in `src/App.jsx` and `src/index.jsx`.
- Vite 8.3.8 for the dev server and the production build, with `@vitejs/plugin-react`.
- TypeScript 6.0.3 type-checks the JavaScript files listed in `tsconfig.json`. It emits no files.
- Jest 30.5.2 with jsdom, ts-jest and React Testing Library.
- ESLint 10.14.0, with the React hooks rules applied to `src/`.
- `serve` 14.2.7 serves the built files in production.

## Run it

Use Node 22 (22.23.2 or later) and Bun 1.4.2 or later, as set in `package.json`.

```sh
bun install --frozen-lockfile
bun run start            # Vite dev server
bun run build            # tsc, then vite build into build/
bun run start:prod       # serves build/ on 0.0.0.0, port from PORT (default 3000)
bun run test             # Jest, 23 tests in src/App.test.jsx
bun run lint             # ESLint
bun run test:production  # after a build: serves build/ on 127.0.0.1:18731 and checks the page and its six assets
```

The tests render the component with Testing Library. They cover the four operations through the visible controls, both resets, division by zero, empty and out-of-range input, error recovery and scientific notation.

## Deployment

`nixpacks.toml` installs with `bun install --frozen-lockfile`, runs `bun run build` and starts `bun run start:prod`. The app reads no environment variables. The start script reads `PORT`.
