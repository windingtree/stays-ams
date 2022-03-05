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

Step 3: Yarn

```bash
npm install -g yarn
yarn init --yes
```

Add `export PATH="$(yarn global bin):$PATH"` to `.bashrc` or `.zshrc`

Step 4: Lerna

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

Step 5: Typescript

```bash
yarn global add typescript
```

Step 6: Init Frontend DApps

```bash
cd packages
yarn add -D -W create-react-app create-react-library
yarn create react-app glider --template typescript
yarn create react-app rooms --template typescript
lerna bootstrap
```

Step 7: Smart contracts

```bash
mkdir stays-smart-contracts && cd $_
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
