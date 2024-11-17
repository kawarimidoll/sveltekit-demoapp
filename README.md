# sveltekit-demoapp

SvelteKit CRUD app

```
sveltekit-demoapp
❯ bunx sv create .
┌  Welcome to the Svelte CLI! (v0.6.4)
│
◇  Directory not empty. Continue?
│  Yes
│
◇  Which template would you like?
│  SvelteKit minimal
│
◇  Add type checking with Typescript?
│  Yes, using Typescript syntax
│
◆  Project created
│
◇  What would you like to add to your project? (use arrow keys / space bar)
│  eslint, vitest, drizzle, lucia, paraglide
│
◇  drizzle: Which database would you like to use?
│  PostgreSQL
│
◇  drizzle: Which PostgreSQL client would you like to use?
│  Postgres.JS
│
◇  drizzle: Do you want to run the database locally with docker-compose?
│  No
│
◇  lucia: Do you want to include a demo? (includes a login/register page)
│  Yes
│
◇  paraglide: Which languages would you like to support? (e.g. en,de-ch)
│  en,ja
│
◇  paraglide: Do you want to include a demo?
│  Yes
│
◇  Which package manager do you want to install dependencies with?
│  bun
│
◆  Successfully setup add-ons
│
◆  Successfully installed dependencies
│
◇  Project next steps ─────────────────────────────────────────────────────╮
│                                                                          │
│  1: git init && git add -A && git commit -m "Initial commit" (optional)  │
│  2: bun dev --open                                                       │
│                                                                          │
│  To close the dev server, hit Ctrl-C                                     │
│                                                                          │
│  Stuck? Visit us at https://svelte.dev/chat                              │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────╯
│
◇  Add-on next steps ──────────────────────────────────────────────────╮
│                                                                      │
│  drizzle:                                                            │
│  - You will need to set DATABASE_URL in your production environment  │
│  - Run bun run db:push to update your database schema                │
│                                                                      │
│  lucia:                                                              │
│  - Run bun run db:push to update your database schema                │
│  - Visit /demo/lucia route to view the demo                          │
│                                                                      │
│  paraglide:                                                          │
│  - Edit your messages in messages/en.json                            │
│  - Consider installing the Sherlock IDE Extension                    │
│  - Visit /demo/paraglide route to view the demo                      │
│                                                                      │
├──────────────────────────────────────────────────────────────────────╯
│
└  You're all set!
```

```
❯  bunx @antfu/eslint-config@latest

┌  @antfu/eslint-config v3.8.0
│
◇  There are uncommitted changes in the current repository, are you sure to continue?
│  Yes
│
◇  Select a framework:
│  none
│
◇  Select a extra utils:
│  UnoCSS
│
◇  Update .vscode/settings.json for better VS Code experience?
│  No
│
◇  Bumping @antfu/eslint-config to v3.8.0
│
◇  Added packages ────────╮
│                         │
│  @unocss/eslint-plugin  │
│                         │
├─────────────────────────╯
│
◆  Changes wrote to package.json
│
◆  Created eslint.config.js
│
◆  Setup completed
│
└  Now you can update the dependencies and run eslint . --fix
```

need to fix `node/prefer-global/process` and `unused-imports/no-unused-vars`
