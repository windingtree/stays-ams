import type { AddressReference, MediaReference } from '@windingtree/org.json-schema/types/org.json';
import { LodgingFacilityRaw, SpaceRaw } from './types';
export declare const randomItem: (array: any[]) => any;
export declare const iterator: <T>(count: number, callback: () => T) => T[];
export declare const createFakeAddress: () => AddressReference;
export declare const createFakeImage: () => MediaReference;
export declare const createFakeLodgingFacility: () => LodgingFacilityRaw;
export declare const createFakeSpace: () => SpaceRaw;
