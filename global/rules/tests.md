---
paths:
  - "**/*.{test,spec}.*"
  - "**/*_test.{go,py,rb}"
  - "**/test_*.py"
  - "**/{tests,test,__tests__,spec,e2e}/**"
---

# Test defaults

- Test behaviour through the public interface, so the test survives a refactor that keeps behaviour the same.
- Take the expected value from an independent source: a literal, a worked example, the spec. A test that recomputes the answer the way the code does can never fail.
- Name the test after the behaviour: "rejects an expired token", not "test validate 2".
- One behaviour per test. A failure should point at one cause.
- Replace only what crosses a system boundary: network, clock, randomness, third-party services. Use the real module for everything you own.
- Make it deterministic: fixed clock, seeded randomness, isolated temp directory, no dependence on test order. Wait on a condition, never on a sleep.
- Write a new test, watch it fail for the right reason, then make it pass.
- A regression test reproduces the bug as it happened at the call site, and its name says which bug.
