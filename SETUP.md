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
