require('./config');
import {DataTypes, Sequelize} from 'sequelize';

const User = require('../models/user');
const BlockNumber = require('../models/blocknumber');
const {sequelize} = require('../models/index')
// const a = async () => {
//   const books = new NewBooks();
//   await books.process().then(() => console.log(books, 12313132))
// }
// a();


// const User = sequelize.define('User', {
//   name: DataTypes.STRING,
//   birthdate: DataTypes.DATE,
// });

// let sequelize = new Sequelize('sqlite', '', '', {
//   dialect: 'sqlite',
//   host: './development.db',
// });
let user = User(sequelize, DataTypes)
// user.create({
//   name: 'фывафыfdhhhfва',
//   birthdate: new Date(1980, 6, 20),
// })
let block = BlockNumber(sequelize, DataTypes)
// block.create({
//   "block_number": 12354001
// })
const a = async () => {
  const b = await block.findOne({
    order: [
      ['id', 'desc']
    ]
  });
  console.log(b);
}
a();

