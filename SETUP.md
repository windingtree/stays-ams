Global dependencies: `node` and `nvm`

## Step 1: NVM

```bash
echo "v16.14.0" > .nvmrc
nvm use
```

## Step 2: `.gitignore`

```bash
echo "node_modules\n.DS_Store\ntypechain\n.env\n" > .gitignore
```

## Step 3: Yarn

```bash
npm install -g yarn
yarn init --yes
```

Add `export PATH="$(yarn global bin):$PATH"` to `.bashrc` or `.zshrc`

## Step 4: Lerna

```bash
yarn global add lerna
lerna init
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

## Step 5: Typescript

```bash
yarn global add typescript
```

## Step 6: Init Frontend DApps

```bash
cd packages
yarn add -D -W create-react-app create-react-library
yarn create react-app glider --template typescript
yarn create react-app rooms --template typescript
lerna bootstrap
```

## Step 7: Smart contracts

```bash
mkdir smart-contracts && cd $_
yarn init
```

Edit `package.json`

```json
{
  "name": "stays-smart-contracts",
  "version": "0.0.1",
  "license": "GPL3"
}
```

Hardhat

```bash
yarn add -D hardhat
yarn run hardhat # > Create an empty hardhat.config.js
```

Typescript

```bash
yarn add -D ts-node chai @types/node @types/mocha @types/chai @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai typechain@7.0.0 @typechain/hardhat @typechain/ethers-v5
tsc --init
mv hardhat.config.js hardhat.config.ts
```

Change `tsconfig.json` to:

```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist"
  },
  "include": ["./scripts", "./test", "./typechain"],
  "files": ["./hardhat.config.ts"]
}
```

Change `hardhat.config.ts` to

```typescript
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

module.exports = {
  solidity: {
    version: '0.8.8'
  }
}
```

Structure

```bash
mkdir contracts test
```

## Step 8: Documentation Package

```bash
cd packages
mkdir docs && cd $_
yarn init --yes
echo "# Stays: on-chain bookings" > README.md
```

Edit `package.json`

```json
{
  "name": "stays-docs",
  "version": "0.0.1",
  "license": "MIT"
}
```

## Step 9: ESLint and Prettier

In project root:

```bash
echo "**/*.js\nnode_modules\nbuild" > .eslintignore
```

```bash
yarn add -D -W eslint-plugin-react@^7.28.0 @typescript-eslint/eslint-plugin@latest eslint-config-airbnb@latest eslint@^8.2.0 eslint-plugin-import@^2.25.3 eslint-plugin-jsx-a11y@^6.5.1 eslint-plugin-react-hooks@^4.3.0 @typescript-eslint/parser@latest eslint-import-resolver-typescript
yarn add -D -W prettier eslint-config-prettier eslint-plugin-prettier
cd packages/glider
yarn eslint --init
```

Answer

```
1. To check syntax, find problems, and enforce code style
2. JavaScript modules (import/export)
3. React
4. Yes
5. Browser
6. Use a popular style guide
7. Airbnb
8. JSON
9. No
```

Add to `.eslintrc.json`

```json
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "plugins": [
    "react-hooks",
    "prettier"
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [
          ".tsx"
        ]
      }
    ],
    "import/prefer-default-export": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "ts": "never",
        "tsx": "never"
      }
    ],
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/jsx-one-expression-per-line": "off",
    "no-use-before-define": "off"
  },
  "settings": {
    "import/resolver": {
        "typescript": {}
    }
  }
```

Create `prettier.config.js`

```js
module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  allowParens: 'avoid'
}
```

Now, copy the two config files to `rooms` as well

```bash
cp .eslintrc.json prettier.config.js ../rooms
```