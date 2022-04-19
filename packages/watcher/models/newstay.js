'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewStay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NewStay.init({
    facility_id: DataTypes.STRING,
    space_id: DataTypes.STRING,
    token_id: DataTypes.STRING,
    email: DataTypes.STRING,
    guest_count: DataTypes.NUMBER, //room_count
    status: DataTypes.NUMBER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'NewStay',
  });
  return NewStay;
};
