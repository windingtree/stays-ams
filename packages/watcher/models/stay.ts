'use strict';
import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from 'sequelize';

export class Stay extends Model<InferAttributes<Stay>, InferCreationAttributes<Stay>> {
  declare id: CreationOptional<number>
  declare facility_id: string
  declare space_id: string
  declare token_id: string
  declare email: string
  declare quantity: number
  declare status: number
  declare start_date: Date
  declare end_date: Date
  declare data: JSON
}

export let StayInit;
export default StayInit = (sequelize): typeof Stay => {
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
    start_date: {type: DataTypes.DATE},
    end_date: {type: DataTypes.DATE},
    data: {type: DataTypes.JSON}
  }, {
    sequelize,
    modelName: 'Stay',
  });
  return Stay;
};
