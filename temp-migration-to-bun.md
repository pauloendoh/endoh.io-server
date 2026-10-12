Setup is in place: pnpm installs the packages, Bun runs the dev server and tests, TypeScript 7 does the type checks and builds, and oxlint lints. I couldn't test against a real database: your local Postgres has no endoh.io database. So the server and both tests stop at the DB connection, and the tests fail there. The compiled build running on Node stops at the same error, so Bun and the build reach the same point.

Speed

- Type check takes about 1.5s and full build about 2s with TS 7.0.2.
- bun test runs the 2 test files in about 0.4s.
- Lint runs in about 1.8s.

Scripts and tools

- dev is now bun --watch src/server.ts, and watch is the same with --inspect.
- test and test:watch use bun test. bunfig.toml limits tests to src, so compiled tests in build/ don't run twice.
- typeorm runs the CLI under Bun. I also corrected makeMigrations and makeEmptyMigration to the typeorm 0.3 syntax (the old -n flag no longer exists).
- New scripts: typecheck, lint, lint:fix, and migrate:prod.
- Production still runs node -r newrelic build/server.js, and its migrations run from the compiled build/dataSource.js. I kept Node there because the New Relic agent is built for Node.
- Removed jest, ts-jest, ts-node, ts-node-dev, nodemon, jest.config.js, package-lock.json and .npmrc. typescript@7.0.2, oxlint and @types/bun are now dev dependencies, and packageManager is set to pnpm@12.11.2.
- pnpm-workspace.yaml lists which packages may run install scripts (puppeteer, re2, newrelic native modules, protobufjs). pnpm blocks them otherwise.

Config

- tsconfig.json now uses moduleResolution: "bundler", because TS 7 removed the old node mode. Target is es2022 with useDefineForClassFields: false, so TypeORM entities keep their current class-field behaviour. Only src is compiled.
- .oxlintrc.json treats correctness rules as errors and suspicious ones as warnings. I switched off rules that only produced noise, and unused variables are warnings (109 of them for now).

Code changes needed by TS 7

- @ts-rest/express/src/lib/types can no longer be imported directly. A local src/types/RouterImplementation.ts now provides that type.
- EmailService now uses the default @sendgrid/mail instance instead of new MailService(). It still only calls setApiKey on it.

Code changes needed by Bun

- Type-only imports: Bun compiles each file on its own, so it breaks on imports that are only types when they are used in decorated parameters or fields. I marked 15 of them with type (DTO interfaces, MyAuthRequest, and others). The runtime result is the same as before.
- Circular entity imports: Bun failed with Cannot access 'User' before initialization because entities import each other. I wrapped 64 relation fields in TypeORM's Relation<...>, which is TypeORM's documented fix for this.
- PlayerChampion: role and skillLevel now declare @Column({ type: "varchar" }) explicitly. Bun can't work out the column type from a string-union type the way the old compiler did. The database column is the same.

Lint fixes

- Removed 3 empty files and a try/catch that only re-threw the error.
- Changed Number to number and removed an unnecessary escape inside a SQL string.

Other files

- CI now uses pnpm on Node 24 and runs lint before build.
- The Dockerfile uses node 24 with pnpm and Bun.
- The husky pre-push hook runs typecheck and lint.
- The README now uses pnpm commands.

Things to watch

- The TypeScript 7 check does not catch the type-only import problem; it only shows up as a crash when Bun loads the file. If you add a type-only import in a decorated signature, write it as import type.
- Heroku has to support pnpm@12 through corepack. I haven't verified that, so check the first deploy.
- Please create the local database and run pnpm migrate and pnpm test to finish verifying.

Nothing is committed yet.

---
