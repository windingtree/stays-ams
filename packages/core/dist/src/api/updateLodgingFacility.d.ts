import type { Stays } from 'stays-smart-contracts';
import type { LodgingFacilityRaw } from 'stays-data-models';
import type { Web3StorageApi } from '@windingtree/ipfs-apis';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
export declare const updateLodgingFacility: (contract: Stays, web3Storage: Web3StorageApi, lodgingFacilityId: string, profileData: LodgingFacilityRaw, overrides?: MethodOverrides | undefined, transactionHashCb?: TxHashCallbackFn | undefined, confirmations?: number) => Promise<string>;
