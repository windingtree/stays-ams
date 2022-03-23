# Stays: on-chain bookings

## Installation

Make sure you have `node` and `nvm` installed.

```bash
nvm use
npm install -g yarn
yarn install
lerna bootstrap
```

Make sure to run `lerna bootstrap` after any `git pull` or whenever you have a problem with missing dependencies.

## Local Development

- Sign Up for [Web3.Storage](https://web3.storage/), get an API key
- Create a `packages/smart-contracts/.env` file (if you don't have one) and add the Web3.Storage API key to it there as follows

  ```
  WEB3STORAGE_KEY=<Web3.Storage API key>
  ```

- Open `packages/smart-contracts` in two terminal windows. Run `yarn start:node` in one and then `yarn start:setup` in the other one.
- Add `packages/dapp/.env` config

  ```
  FAST_REFRESH=true
  BROWSER=false
  HTTPS=true
  REACT_APP_LOG_LEVEL=debug
  REACT_APP_FILE_WEB3STORAGE_KEY=<Web3.Storage API key>
  REACT_APP_NETWORK_ID=31337
  REACT_APP_NETWORK_PROVIDER=http://127.0.0.1:8545
  REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
  ```

- Add Hardhat Testnet network to your Metamask
  - URL: `http://127.0.0.1:8545`
  - Chain ID: `31337`
- Add to Metamask some of the private keys from the hardhat console output that will be displayed when you run `yarn start:node`
- Start the Dapp from `packages/dapp`: `yarn start`
