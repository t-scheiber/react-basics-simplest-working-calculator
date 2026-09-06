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

Tests exercise the rendered calculator, accumulated operations, negative/decimal input, both reset controls, and its existing division-by-zero behavior. No external service or credentials are required.
