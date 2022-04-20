'use strict';
import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  class Stay extends Model<InferAttributes<Stay>, InferCreationAttributes<Stay>> {
    declare id: CreationOptional<number>
    declare facility_id: string
    declare space_id: string
    declare token_id: string
    declare email: string
    declare quantity: number
    declare status: number
    declare start_date: Date
    declare end_date: Date
  }

  Stay.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    facility_id: {type: DataTypes.STRING},
    space_id: {type: DataTypes.STRING},
    token_id: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    quantity: {type: DataTypes.STRING},
    status: {type: DataTypes.INTEGER},
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Stay',
  });
  return Stay;
};
