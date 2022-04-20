import {TokenEntity} from "../types";
import {StaysRepositoryInterface} from "./interfaces/StaysRepositoryInterface";
const Stay = require('../../models/stay');

const {sequelize} = require('../../models/index')

export default class implements StaysRepositoryInterface {
  private stayModel: typeof Stay;

  constructor() {
    this.stayModel = Stay(sequelize);
  }

  async getUnprocessed(): Promise<Array<typeof Stay>> {
    return await this.stayModel.findAll(
      {
        where: {
          status: 0
        }
      }
    );
  }

  async store(entities: TokenEntity[]) {
    const mappedEntities = this.mapEntity(entities);
    await this.stayModel.bulkCreate(mappedEntities)

    return true;
  }

  private mapEntity(entities: TokenEntity[]): Array<{}> {
    return entities.map(entity => {
      return {
        facility_id: entity.facilityId,
        space_id: entity.spaceId,
        token_id: entity.tokenId,
        email: entity.facility?.contact.email,
        quantity: entity.quantity,
        status: 0,
        start_date: entity.startDayParsed,
        end_date: entity.endDayParsed
      }
    })
  }
}
