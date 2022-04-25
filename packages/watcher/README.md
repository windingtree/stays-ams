## Installation
### Database requirements
sqlite `^3.35.5`

### Database operations
`npx sequelize-cli db:migrate` [migrations]

`npx sequelize-cli db:seed:all` [seeder]

`npx ts-node src/index.ts` [run worker]
