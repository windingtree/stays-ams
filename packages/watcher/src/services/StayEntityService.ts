import {Contract, StayToken} from "stays-core";
import {TokenEntity} from "../types";
import BlockRepository from "../repositories/BlockRepository";

export default class StayEntityService {
  protected contract: Contract;
  protected dayZero = new Date(1645567342 * 1000); //date from smart contract (getZeroDay)
  private tokens: Set<Promise<StayToken>>;
  private tokenEntities: TokenEntity[];

  constructor(contract: Contract) {
    this.contract = contract;
  }

  public async process() {
    await this.getTokens();
    await this.makeTokenEntities();
    await this.fillNeededFacilitiesAndSpaces();
    await this.setLastBlockNumber();
  }

  public async getTokens() {
    const blockNumber = await (new BlockRepository()).getLastBlockNumber();
    const contractIds = await this.contract.getNewBookingsTokenIds(blockNumber)
    const tokens = new Set<Promise<StayToken>>();

    contractIds.map(v => {
      tokens.add(this.contract.getToken(v.toString()));
    });

    this.tokens = tokens;
  }

  public async makeTokenEntities() {
    const tokenEntities = new Set<TokenEntity>();
    const tokens = await Promise.all(this.tokens);

    tokens.map(t => {
      const startDay = t.data.attributes?.find(i => i.trait_type === 'startDay')?.value || '0';
      const numberOfDays = t.data.attributes?.find(i => i.trait_type === 'numberOfDays')?.value || '0';
      const tokenEntity: TokenEntity = {
        tokenId: t.tokenId,
        name: t.data.name,
        description: t.data.description,
        image: t.data.image,
        external_url: t.data.external_url,
        facilityId: t.data.attributes?.find(i => i.trait_type === 'facilityId')?.value,
        spaceId: t.data.attributes?.find(i => i.trait_type === 'spaceId')?.value,
        startDay,
        numberOfDays,
        startDayParsed: this.addDaysAndParse(parseInt(startDay)),
        endDayParsed: this.addDaysAndParse(parseInt(startDay), parseInt(numberOfDays)),
        quantity: t.data.attributes?.find(i => i.trait_type === 'quantity')?.value,
      };

      if (t.status === 'booked' && tokenEntity.spaceId && tokenEntity.facilityId) {
        tokenEntities.add(tokenEntity);
      }
    });

    this.tokenEntities = Array.from(tokenEntities);
  }

  private async fillNeededFacilitiesAndSpaces() {
    const facilityIds = this.tokenEntities.map(e => e.facilityId || '');
    const facilities = await Promise.all(facilityIds.map(id => this.contract.getLodgingFacility(id)));

    const spaceIds = this.tokenEntities.map(e => e.spaceId || '');
    const spaces = await Promise.all(spaceIds.map(id => this.contract.getSpace(id)));

    this.tokenEntities.map(t => {
      t.facility = facilities.find(i => i?.contractData.lodgingFacilityId === t.facilityId) || undefined
      t.space = spaces.find(i => i?.contractData.spaceId === t.spaceId) || undefined
    })
  }

  private addDaysAndParse(days: number, moreDays = 0): Date {
    const date = new Date(this.dayZero);
    date.setDate(date.getDate() + days + moreDays);
    return date;
  }

  public getTokenEntities() {
    return this.tokenEntities;
  }

  private async setLastBlockNumber() {
    const blockNumber = await this.contract.provider.getBlockNumber();
    await (new BlockRepository()).store(blockNumber);
  }
}
