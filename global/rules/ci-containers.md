---
paths:
  - "**/.github/workflows/**"
  - "**/.gitlab-ci.yml"
  - "**/Dockerfile*"
  - "**/*.dockerfile"
  - "**/docker-compose*.{yml,yaml}"
  - "**/compose*.{yml,yaml}"
---

# CI and container defaults

## Workflows

- Set `permissions:` at the top of each workflow to the least it needs, usually `contents: read`, and widen per job.
- Pin third-party actions to a full commit SHA with the version in a comment.
- Untrusted input (PR titles, branch names, issue bodies) reaches a script through an environment variable, never through `${{ }}` inside `run:`.
- `pull_request_target` and `workflow_run` run with secrets. Keep code from the pull request out of those jobs.
- CI runs the same `scripts/check` a developer runs locally, so there is one definition of healthy.
- Cache dependencies by lockfile hash and cancel superseded runs with a `concurrency` group.

## Containers

- Build in stages; the final image holds the runtime and the built output only.
- Pin the base image by version, and by digest for releases.
- Run as a non-root user and pass secrets at run time; a secret in a layer or build argument stays in the image history.
- Copy the dependency manifest and install before copying the source, so a source change keeps the dependency layer cached.
- Add a `.dockerignore` that excludes `.git`, dependencies, build output and env files.
