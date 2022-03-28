import type { Stays } from 'stays-smart-contracts';
import type { LodgingFacility } from 'stays-data-models';
import type { Web3StorageApi } from '@windingtree/ipfs-apis';
export declare const getLodgingFacility: (contract: Stays, web3Storage: Web3StorageApi, lodgingFacilityId: string) => Promise<LodgingFacility | null>;
