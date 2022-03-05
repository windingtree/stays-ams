Global dependencies: `node` and `nvm`

Step 1: NVM

```bash
echo "v16.14.0" > .nvmrc
nvm use
```

Step 2: `.gitignore`

```bash
echo "node_modules\n.DS_Store\n.env\n" > .gitignore
```

Step 3: Yarn and Lerna

```bash
npm install -g yarn
yarn init --yes
yarn add -D lerna
yarn lerna init
```

Add to `lerna.json`

```json
{
  "packages": [
    "packages/*"
  ],
  "version": "0.0.1",
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

Add to `package.json`

```json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "test": "lerna run test",
    "new-version": "lerna version --conventional-commits --yes",
    "diff": "lerna diff"
  }
}
```

Step 4: Conventional Commits

```bash
yarn add -D -W git-cz
```
