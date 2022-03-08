# Stays: on-chain bookings

## Installation

Make sure you have `node` and `nvm` installed.

```bash
nvm use
npm install -g yarn
yarn install
lerna bootstrap
```

## Start All Apps

`lerna run start`

## Test All Apps

`lerna run test`

or

`lerna run test --scope=stays-smart-contracts`

or

`lerna run test --scope='{stays-smart-contracts,stays-rooms}'`