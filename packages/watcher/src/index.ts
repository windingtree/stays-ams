import BlockRepository from "./repositories/BlockRepository";

require('./config');
import {DataTypes, Sequelize} from 'sequelize';
import {book} from "stays-core/dist/src/api/book";
import StaysRepository from "./repositories/StaysRepository";
import StayEntityService from "./services/StayEntityService";
import {makeContract} from "./helpers";

const User = require('../models/user');
const BlockNumber = require('../models/blocknumber');
const {sequelize} = require('../models/index')
// const a = async () => {
//   const books = new NewBooks();
//   await books.process().then(() => console.log(books, 12313132))
// }
// a();


let block = BlockNumber(sequelize, DataTypes)
// block.create({
//   "block_number": 12354001
// })
const stay = new StaysRepository()
const a = async () => {
  const contract = await makeContract();
  if (!contract) throw new Error();
  const books = new StayEntityService(contract);
  await books.process();
  console.log(books.getTokenEntities()[0]);
  await stay.store(books.getTokenEntities()); //store is ok
}
a();

