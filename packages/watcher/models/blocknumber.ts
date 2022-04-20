'use strict';

import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';


module.exports = (sequelize) => {
  class BlockNumber extends Model<InferAttributes<BlockNumber>, InferCreationAttributes<BlockNumber>> {
    declare id: CreationOptional<number>
    declare block_number: bigint
  }
  BlockNumber.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    block_number: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'BlockNumber',
  });
  return BlockNumber;
};
