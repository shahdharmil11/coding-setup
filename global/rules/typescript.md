---
paths:
  - "**/*.{ts,tsx,mts,cts}"
---

# TypeScript defaults

The project's tsconfig, lint config and existing patterns win over these.

- Use the package manager whose lockfile is in the repo. One lockfile, one tool.
- Type external data by parsing it at the boundary with the project's schema library. A cast on `JSON.parse`, `fetch().json()` or `process.env` output proves nothing.
- Reach for `unknown` plus narrowing where `any` tempts. Fix a type error at its cause; `as`, `!` and `@ts-ignore` only hide it.
- Model variants as discriminated unions and end the `switch` with a `never` check, so a new variant fails to compile until it is handled.
- Every promise is awaited, returned, or explicitly marked `void` with a reason.
- Derive types from one source (`z.infer`, `typeof`, `ReturnType`, `satisfies`) so a shape is declared once.
- After editing, run the project's typecheck script. It is the fastest check there is.
