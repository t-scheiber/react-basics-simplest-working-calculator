# Simplest Working Calculator

A React calculator with a running result and controls for addition, subtraction, multiplication, division, and resetting the input or result.

Use Node 22.23.2 or a later Node 22 release and Bun 1.4.2.

```sh
bun install --frozen-lockfile
bun run test --runInBand --watch=false
bun run build
bun run lint
bun run start:prod
```

The build command checks the application JavaScript with TypeScript and creates static files in `build/`. The production command serves those files using the locked local `serve` dependency, listening on `0.0.0.0` and `PORT` (default 3000). `bun start` starts the development server.

The calculator keeps the last valid result when an input is empty or invalid, a divisor is zero, or an operation would overflow. It displays an accessible error message instead of Infinity or NaN. A valid operation or either reset button clears the error. Negative numbers, decimals and finite scientific notation remain supported.

The 23 rendered component tests cover arithmetic, both reset controls, zero divisors, invalid input, overflow, error recovery and accessibility. Division-by-zero tests now require the error and retained result, replacing the earlier test that preserved Infinity. `bun run test:production` checks the built page and its six local assets through the locked production server. No external service or credentials are required.
