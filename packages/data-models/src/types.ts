import { BigNumber } from 'ethers';
import type {
  LegalEntityReference,
  OrganizationalUnitReference
} from '@windingtree/org.json-schema/types/org.json';

export interface GenericStateRecord {
  id: string;
  [key: string]: unknown;
}

export interface SpaceRaw extends OrganizationalUnitReference, GenericStateRecord {}

export interface LodgingFacilityRaw extends LegalEntityReference, GenericStateRecord {}

export interface Space extends SpaceRaw {
  active: boolean;
  lodgingFacilityId: string;
  capacity: number;
  pricePerNightWei: BigNumber;
  dataURI: string;
  updated: string;
}

export interface LodgingFacility extends LodgingFacilityRaw {
  active: boolean;
  owner: string;
  dataURI: string;
  updated: string;
  spaces: Space[];
}