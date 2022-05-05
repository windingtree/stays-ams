import { TokenEntity } from "../types";
import { StaysRepositoryInterface } from "./interfaces/StaysRepositoryInterface";
import { Stay, StayInit } from '../../models/stay';
import { sequelize } from '../../models';
import { BigNumber as BN, utils } from "ethers";

export default class implements StaysRepositoryInterface {
  private stayModel: typeof Stay;

  constructor() {
    this.stayModel = StayInit(sequelize);
  }

  async getUnprocessed(): Promise<Array<typeof StayInit>> {
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
    await this.stayModel.bulkCreate(mappedEntities);
  }

  private mapEntity(entities: TokenEntity[]): Array<typeof StayInit> {
    return entities.map(entity => {
      const total = BN.from(entity.space?.contractData.pricePerNightWei || 0)
        .mul(BN.from(entity.numberOfDays))
        .mul(BN.from(entity.quantity)).toString();
      const totalEther = utils.formatUnits(total, 'ether');

      return {
        facility_id: entity.facilityId,
        space_id: entity.spaceId,
        token_id: entity.tokenId,
        email: entity.facility?.contact?.email,
        quantity: entity.quantity,
        status: 0,
        start_date: entity.startDayParsed?.setUTCHours(12,0,0),
        end_date: entity.endDayParsed?.setUTCHours(12,0,0),
        data: {
          name: entity.facility?.name,
          price: totalEther,
          address: entity.facility?.address,
          contact: entity.facility?.contact
        }
      };
    });
  }
}
