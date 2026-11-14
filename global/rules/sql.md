---
paths:
  - "**/*.sql"
  - "**/migrations/**"
  - "**/migrate/**"
  - "**/schema.prisma"
---

# Database and migration defaults

- A migration that has run anywhere is frozen. Change the schema with a new migration.
- Make breaking changes in three deploys: expand (add the new shape beside the old), migrate (backfill and move readers and writers), contract (remove the old shape once nothing reads it).
- Each migration either reverses cleanly or says in a comment that it cannot and why.
- Watch lock time on large tables: build indexes concurrently where the engine supports it, add columns as nullable or with a constant default, backfill in batches.
- Queries take parameters. Values never reach SQL through string concatenation or interpolation.
- Wrap statements that must succeed together in one transaction.
- Index every foreign key and every column a hot query filters or joins on; check the plan for a query on a large table.
- Store money as integer minor units or a decimal type, and timestamps in UTC with time zone.
