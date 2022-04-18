'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlockNumber extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BlockNumber.init({
    block_number: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'BlockNumber',
  });
  return BlockNumber;
};