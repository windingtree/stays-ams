import { BigNumber } from 'ethers';
import type {
  LegalEntityReference,
  OrganizationalUnitReference
} from '@windingtree/org.json-schema/types/org.json';

export interface SpaceRaw extends OrganizationalUnitReference {}

export interface LodgingFacilityRaw extends LegalEntityReference {}

export interface Space extends SpaceRaw {
  spaceId: string;
  active: boolean;
  lodgingFacilityId: string;
  capacity: number;
  pricePerNightWei: BigNumber;
  dataURI: string;
  updated: string;
}

export interface LodgingFacility extends LodgingFacilityRaw {
  lodgingFacilityId: string;
  active: boolean;
  owner: string;
  dataURI: string;
  updated: string;
  spaces: Space[];
}