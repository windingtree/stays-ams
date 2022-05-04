## About

- Service get all new bookings from blockchain `NewStay` journal
- Get all needed hotels
- Puts info in the Database
- Send info about new bookings to hotels
- Worker get needed info every 1 minute

## Installation

### env
- cp .env.example .env
- Fill the fields in .env


### Database requirements
sqlite `^3.35.5`

### Database operations
`npx sequelize-cli db:migrate` [migrations]

`npx sequelize-cli db:seed:all` [seeder]

BlockNumbers - needed for check block number where the log will be read from

Stays - info about booking (status {0: not_sent, 1: sent info to the hotel})


## Start

`npx ts-node src/index.ts` [run worker]

## How to test

- Run worker
- Make new booking
- Await max 1 minute
- check Database for new records (BlockNumbers, Stays tables)
- check hotel mailbox for email with booking info

  (for testing in .env fill SENDRID_EMAIL_TO={123@gmail.com} parameter change all hotel email addresses to {123@gmail.com})
