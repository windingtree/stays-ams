# Stays: On-Chain Bookings

Brought to you by Winding Tree.

ETH events: https://windingtree.notion.site/4651949b092742ea96d7513b87cc8419?v=cb368230969749ba87d91681f434a05e

## Contract Address (TBD)

TODO `0x0000000000000000000000000000000000000000`

## Local Development

After you clone the repo, make sure you have (Node Version Manager)[https://github.com/nvm-sh/nvm] installed.

```bash
git clone git@github.com:windingtree/eth-rio-smart-contracts.git
cd eth-rio-smart-contracts
nvm use
yarn
```

You may need to install typescript: `npm i -g typescript`

- run tests: `npx hardhat test`
- run test networ: `npx hardhat node`
- regenerate typings: `npx hardhat typechain`

## Project Goal

The goal of this project is to allow lodging providers (hotels, individual apartment owners, etc.) to allow booking of ther properties directly, without any intermediaries.

## Workflow

1. A lodging facility (hotel, hostel, etc.) owner registers one (or more) of their facilities with the smart contract
1. Then they add details of their accommodation options, e.g. hotel room types
1. Once the have done that, their inventory is now available for searching and booking, so, someone sends the requireed amount of xDai to the smart contract and...
1. ...books a room. In return they receive a Stay NFT, which has information about the hotel, the room they booked, etc.
1. The amount sent is now locked in a special escrow module of the smart contract, and will not be fully available to the hotel until the check-out.
1. At the same time, the guest is able to cancel the reservation any time before check in, and get 100% of their money back.
1. The guest may also modify their reservation at any time, paying an additional fee if required, or getting a refund, if booken fewer days/rooms. In this case their Stay NFT is modified accordingly.
1. On check in day, guest or hotel may initiate the check-in process, but in either case, the other party has to confirm, and when that happens, their Stay NFT status changes accordingly, and the amount of xDai for the first day of their stay (with a % going to Ukraine DAO automatically)
1. At this point the guest is not able to cancel or modify the reservation (this is an MVP!), the Stay NFT becomes soulbound (not transferable)
1. On the check out day, the hotel owner is able to claim the rest of the amount from the escrow (and, again, a % would go to Ukraine DAO). This action also mints a certain number of WIN tokens (1 xDai = 1 WIN) which are given to the Stay NFT holder.
1. At any point, the holder of Stay NFT is able to leave a review.
1. All the Stay NFTs booked via this smart contract are able to mint a unique set of NFTs from the local artists

# User Stories

The assumption here is that all the actors below are logged in to the ecosystem using their Ethereum wallet, and that they're on Gnosis Chain. Stories marked with "*" are not required for the MVP.

## Facility Owner User Stories

### Facility Management

As a Facility Owner or Manager, I should be able to:

- register my Lodging Facility (LF) with the Stays smart contracts
- modify any of my LF details
- deactivate my LF
- unregister (remove) my LF
- add a Space (room type) to my LF
- modify any of the Space details
- deactivate a Space
- remove a Space
- authorize an EOA to be able to manage reservations (view, check in, check out)
- view the amount of xDai currently in escrow
- view the amount of xDai claimable from escrow (and a breakdown of how it will be increasing day by day)
- claim xDai from escrow
- answer a review*
- start a dispute around a review*
- leave a review for the guest*

### Reservation Management

As a user authorized to manage rezervations, I should be able to:

- view all the reservations
- view details of any reservation, including guest contact information
- on check-in day (or any other day within the Stay range), initiate or confirm check-in

### Stay Management

- see all the guests currently at my facilities

### Loalty Program*

TODO

## Guest User Stories

As a traveler, I should be able to:

### Before Booking

- view all the LFs in the area
- view details of any AP, including their Space information, prices, and reviews
- book any Space, if it's available, by sending a required amount of xDai
- buy a Stay NFT on the marketplace*

### Before Check In

- view all my reservations
- transfer my Stay NFT to someone else
- modify my information (name, contact details, etc.)
- on check-in day (or any other day within the Stay range), initiate or confirm check-in
- leave a review
- list my Stay NFT for sale on the marketplace*

### During the Stay

- leave a review
- ...

### After Check Out

- leave a review
- start a dispute on a review*

## Frens User Stories

Fren is a person who onboards a Lodging Facility. For every booking made at a facility they onboard, they will receive a certain amount (TBD) of LIF tokens.

# Stays Data Management

Here's a breakdown of on-/off-chain data.

TODO


## TESTING ENVIRONMENT SETUP FOR THE DAPP

- `.env` in the ./packages/smart-contracts

```
WEB3STORAGE_KEY=<WEB3_STORAGE_KEY>
```

- setup (command must be started from the ./smart-contracts package directory)

```bash
yarn start:node
yarn start:setup
```

Commands above will:

- create a local Ethereum server
- register 3 lodging facility with 3 spaces in each

> To make available local node for Metamask the `http://127.0.0.1:8545/` must be registered as a custom RPC

> Here the link where listed predefined accounts for the node: https://hardhat.org/hardhat-network/reference/#initial-state
> First one is used for deployments