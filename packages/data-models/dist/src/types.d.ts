import { BigNumber } from 'ethers';
import type { MediaListReference, AddressReference } from '@windingtree/org.json-schema/types/org.json';
import { allowedSpaceTypes, allowedLodgingFacilityTypes, allowedLodgingFacilityTiers } from './enum';
export declare type SpaceType = typeof allowedSpaceTypes[number];
export declare type LodgingFacilityType = typeof allowedLodgingFacilityTypes[number];
export declare type LodgingFacilityTier = typeof allowedLodgingFacilityTiers[number];
export interface SpaceRaw {
    name: string;
    description: string;
    capacity: number;
    guestsNumber: number;
    beds: number;
    price: number;
    type: SpaceType;
    media: MediaListReference;
}
export interface LodgingFacilityRaw {
    name: string;
    description: string;
    type: LodgingFacilityType;
    tier: LodgingFacilityTier;
    address: AddressReference;
    what3words?: string;
    operator: {
        name: string;
        address: AddressReference;
    };
    media: MediaListReference;
}
export interface Space extends SpaceRaw {
    contractData: {
        spaceId: string;
        active: boolean;
        lodgingFacilityId: string;
        capacity: number;
        pricePerNightWei: BigNumber;
        dataURI: string;
    };
    updated: string;
}
export interface LodgingFacility extends LodgingFacilityRaw {
    contractData: {
        lodgingFacilityId: string;
        active: boolean;
        owner: string;
        dataURI: string;
    };
    updated: string;
    spaces: Space[];
}
