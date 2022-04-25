'use strict';

import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from 'sequelize';

export class BlockNumber extends Model<InferAttributes<BlockNumber>, InferCreationAttributes<BlockNumber>> {
  declare id: CreationOptional<number>
  declare block_number: number
}

export const BlockNumberInit = (sequelize): typeof BlockNumber => {
  BlockNumber.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    block_number: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BlockNumber',
  });
  return BlockNumber;
};
