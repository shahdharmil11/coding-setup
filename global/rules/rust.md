---
paths:
  - "**/*.rs"
  - "**/Cargo.toml"
---

# Rust defaults

The project's existing patterns and lint config win over these.

- Propagate with `?`. Libraries expose a typed error enum (`thiserror`); binaries may collect with `anyhow` and add `.context(...)`.
- `unwrap` and `expect` belong in tests and in places where the invariant is stated in the `expect` message.
- Borrow first. Add `clone` when ownership is really needed, and prefer `&str` and slices in signatures.
- Make invalid states unrepresentable with enums and newtypes before adding runtime checks.
- Every `unsafe` block carries a `// SAFETY:` comment naming the invariant it relies on.
- Before finishing: `cargo fmt`, `cargo clippy --all-targets -- -D warnings`, `cargo test`.
