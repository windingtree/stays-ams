import {BlockRepositoryInterface} from "./interfaces/BlockRepositoryInterface";

const {sequelize} = require('../../models/index')
const BlockNumber = require('../../models/blocknumber');

export default class implements BlockRepositoryInterface {
  private model: typeof BlockNumber;

  constructor() {
    this.model = BlockNumber(sequelize)
  }

  async getLastBlockNumber(): Promise<number> {
    const lastModel = await this.model.findOne({
      order: [
        ['id', 'desc']
      ]
    });

    return lastModel.block_number;
  }

  store(id: number) {
    this.model.create({
      "block_number": id
    })
  }
}
