import { LodgingFacility, Space } from 'stays-data-models'

export interface TokenEntity {
  tokenId: string,
  name: string,
  description: string,
  image: string,
  external_url?: string,
  facilityId?: string,
  spaceId?: string,
  startDay?: string,
  numberOfDays?: string,
  startDayParsed?: Date,
  endDayParsed?: Date,
  quantity?: string,
  facility?: LodgingFacility,
  space?: Space
}
