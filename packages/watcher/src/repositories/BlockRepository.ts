import { BlockRepositoryInterface } from "./interfaces/BlockRepositoryInterface";
import { sequelize } from '../../models';

import { BlockNumber, BlockNumberInit } from '../../models/blocknumber';

export default class implements BlockRepositoryInterface {
  private model: typeof BlockNumber;

  constructor() {
    this.model = BlockNumberInit(sequelize);
  }

  async getLastBlockNumber(): Promise<number> {
    const lastModel = await this.model.findOne({
      order: [
        [ 'id', 'desc' ]
      ]
    });

    if (!lastModel) {
      throw new Error('model is empty');
    }

    return lastModel.block_number;
  }

  store(id: number) {
    this.model.create({
      "block_number": id
    });
  }
}
