---
paths:
  - "**/*.go"
---

# Go defaults

The project's existing patterns and lint config win over these.

- Return errors; wrap with `fmt.Errorf("doing x: %w", err)` so callers can use `errors.Is` and `errors.As`. Reserve `panic` for programmer errors at startup.
- `context.Context` is the first parameter of anything that does I/O or can block, and it is passed down, never stored.
- Define an interface where it is consumed, with only the methods that consumer calls. Accept interfaces, return concrete types.
- Every goroutine has an owner that knows how it stops. Close channels from the sender.
- Tests are table-driven with `t.Run`, and use `t.TempDir` and `t.Cleanup`.
- Before finishing: `gofmt`, `go vet ./...`, `go test ./...`, plus the project's linter when it has one.
