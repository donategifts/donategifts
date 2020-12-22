# Setup

### install npm 7 globally

```bash
npm install -g npm@7
```

faster installs and automatically adds peer dependencies

---

if you are using vscode, either open up the don-server directory as standalone or add it to your workspace
without this the typescript compiler from vscode doesn't recognize the `tsconfig.json` from the sub directory

```bash
cd website-api && npm install
```

this will install everything needed in the new setup

---

```bash
npm run build
```

will compile the project into the `dist` folder and also generate the tsoa routes

## IMPORTANT: do not manually change the routes.ts file

---

eslint and typescript settings are already ready to go, ecma version support is set to version 2019

---

husky is disabled for commits in the don-server directory for now

---

# IMPORTANT: uncomment the root .eslintrc while you're working on the typescript project to enable eslint support in the don-server directory
