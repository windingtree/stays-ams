import dotenv from "dotenv"
import { StayToken } from "stays-core";
import { TokenEntity } from "./types";
import { makeContract } from "./helpers";

dotenv.config() //todo go to config


class NewBooks {
  protected contract;
  protected dayZero = new Date(1645567342 * 1000);
  private tokens: Set<Promise<StayToken>>;
  private tokenEntities: TokenEntity[];

  public async process() {
    this.contract = await makeContract();
    if (!this.contract) throw new Error();
    await this.getTokens();
    await this.makeTokenEntities();
    await this.fillNeededFacilitiesAndSpaces();
  }

  public async getTokens() {
    const contractIds = await this.contract.getNewBookingsTokenIds(0)
    let tokens = new Set<Promise<StayToken>>();

    contractIds.map(v => {
      tokens.add(this.contract.getToken(v.toString()));
    });

    this.tokens = tokens;
  }

  public async makeTokenEntities() {
    let tokenEntities = new Set<TokenEntity>();
    let tokens = await Promise.all(this.tokens);

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
    const spaces = await Promise.all(spaceIds.map(id => this.contract.getSpace(id)))

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
}

const a = async () => {
  // const books = new NewBooks();
  // await books.process().then(() => console.log(books, 12313132))

  const contract = await makeContract()
  if (!contract) return;
  console.log(contract.getDayZero());
}
a();
