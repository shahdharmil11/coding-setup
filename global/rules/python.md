---
paths:
  - "**/*.py"
  - "**/pyproject.toml"
---

# Python defaults

The project's pyproject settings and existing patterns win over these.

- Use the project's environment tool (`uv`, `poetry`, `pdm`, `hatch`, or a plain venv) for every install and run. A bare `pip install` lands in whichever interpreter happens to be first on the path.
- Type-hint public functions and run the configured checker (`pyright` or `mypy`) after editing.
- Parse external data into a model at the boundary (`pydantic`, `attrs`, or a dataclass with explicit validation); pass plain dicts no further than the parser.
- Catch the specific exception you can handle. Re-raise with `raise ... from err` so the cause survives.
- Default arguments are immutable. Use `None` and build the list or dict inside.
- Prefer `pathlib` for paths and `logging` for diagnostics in library code.
- Tests are `pytest`: fixtures for setup, `parametrize` for cases, `tmp_path` for files.
- Run the project's `ruff` config for lint and format when it has one.
