import {TokenEntity} from "../types";
import {StaysRepositoryInterface} from "./interfaces/StaysRepositoryInterface";
import {DataTypes} from "sequelize";

const {sequelize} = require('../../models/index')
const NewStay = require('../../models/newstay');

export default class implements StaysRepositoryInterface {
  private model: any;

  constructor() {
    this.model = NewStay(sequelize, DataTypes)
  }

  async getUnprocessed(): Promise<Array<{}>> { //todo replace {} to model
    return await this.model.findAll(
      {
        where: {
          status: 0
        }
      }
    );
  }

  async store(entities: TokenEntity[]) {
    const mappedEntities = this.mapEntity(entities);
    await this.model.bulkCreate(mappedEntities)

    return true;
  }

  private mapEntity(entities: TokenEntity[]): Array<{}> {
    return entities.map(entity => {
      return {
        facility_id: entity.facilityId,
        space_id: entity.spaceId,
        token_id: entity.tokenId,
        email: entity.facility?.contact.email,
        guest_count: entity.quantity,
        status: 0,
        start_date: entity.startDayParsed,
        end_date: entity.endDayParsed
      }
    })
  }
}
