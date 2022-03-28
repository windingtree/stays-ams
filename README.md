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

- Open `packages/smart-contracts` in two terminal windows. Run `yarn start:node` in one and then `yarn start:setup` in the other one. Make sure to copy one of the private keys displayed after you run `yarn start:node`.
- Add to `packages/dapp/.env` config:

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

- Add Hardhat Testnet network to Metamask
  - URL: `http://127.0.0.1:8545`
  - Chain ID: `31337`
- Add to Metamask some of the private keys from the hardhat console output that will be displayed when you run `yarn start:node`
- Start the Dapp from `packages/dapp`: `yarn start`

## Sokol Testnet

Contract Address: `0x0cc294153cE26686DE79E2c6bD76027D136ddfF7` ([etherscan](https://blockscout.com/poa/sokol/address/0x0cc294153cE26686DE79E2c6bD76027D136ddfF7))

- [Get SPOA](https://faucet.poa.network/) (Sokol Testned DAI)
- Get your Google Maps API KEY (for getting GPS from Address)
- Change `packages/dapp/.env` config:

  ```
  FAST_REFRESH=true
  BROWSER=false
  HTTPS=true
  REACT_APP_LOG_LEVEL=debug
  REACT_APP_FILE_WEB3STORAGE_KEY=<Web3.Storage API key>
  REACT_APP_GOOGLE_API_KEY=<GOOGLE_API_KEY>
  REACT_APP_MODE=production
  REACT_APP_NETWORK_ID=77
  REACT_APP_NETWORK_PROVIDER=https://sokol.poa.network
  REACT_APP_CONTRACT_ADDRESS=0x0cc294153cE26686DE79E2c6bD76027D136ddfF7
  ```

- Add `Sokol Testnet` to Metamask:
  - URL: `https://sokol.poa.network`
  - Chain ID: `77`
- Start the Dapp from `packages/dapp`: `yarn start`