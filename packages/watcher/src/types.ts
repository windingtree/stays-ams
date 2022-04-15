import type {
  MediaListReference,
  AddressReference,
  MessengerReference
} from '@windingtree/org.json-schema/types/org.json';
import {
  allowedSpaceTypes,
  allowedLodgingFacilityTypes,
  allowedLodgingFacilityTiers
} from './enum';

export type SpaceType =
	typeof allowedSpaceTypes[number];

export type LodgingFacilityType =
	typeof allowedLodgingFacilityTypes[number];

export type LodgingFacilityTier =
	typeof allowedLodgingFacilityTiers[number];

export type Amenity = string;

export interface FacilityContactReference {
  name: string;
  phone: string;
  email: string;
  website: string;
  messengers?: MessengerReference[];
}

export interface SpaceRaw {
  name: string;
  description: string;
  amenities: Amenity[];
  capacity: number;
  guestsNumber: number;
  beds: number;
  price: string;
  type: SpaceType;
  media: MediaListReference;
}

export interface LodgingFacilityRaw {
  name: string;
  description: string;
  type: LodgingFacilityType;
  tier: LodgingFacilityTier;
  amenities: Amenity[];
  contact: FacilityContactReference;
  address: AddressReference;
  what3words?: string;
  operator: {
    name: string;
    address: AddressReference;
  }
  media: MediaListReference;
}

export interface Space extends SpaceRaw {
  contractData: {
    spaceId: string;
    active: boolean;
    lodgingFacilityId: string;
    capacity: number;
    pricePerNightWei: string;
    dataURI: string;
  }
  updated: string;
}

export interface LodgingFacility extends LodgingFacilityRaw {
  contractData: {
    lodgingFacilityId: string;
    active: boolean;
    owner: string;
    dataURI: string;
  },
  updated: string;
  spaces: Space[];
}

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

