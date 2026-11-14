---
paths:
  - "**/*.{sh,bash,zsh}"
  - "**/scripts/check"
---

# Shell script defaults

- Start with `#!/usr/bin/env bash` and `set -euo pipefail`.
- Quote every expansion: `"$var"`, `"$@"`, `"$(cmd)"`.
- Resolve paths from the script's own location (`cd "$(dirname "$0")/.."`) so the script works from any directory.
- Iterate files with globs or `find -print0 | while IFS= read -r -d ''`; output of `ls` is for people.
- Create temp files with `mktemp` and remove them in a `trap ... EXIT`.
- Check for required tools up front with `command -v` and fail with a message that names the missing tool.
- Keep a script that grows past about 100 lines or needs data structures for a real language.
- Run `shellcheck` when it is installed.
