import type { EthRioStays } from 'stays-smart-contracts';
import type { SpaceRaw } from 'stays-data-models';
import type { Web3StorageApi } from '@windingtree/ipfs-apis';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
export declare const addSpace: (contract: EthRioStays, web3Storage: Web3StorageApi, profileData: SpaceRaw, lodgingFacilityId: string, capacity: number, pricePerNightWei: string, active?: boolean, overrides?: MethodOverrides | undefined, transactionHashCb?: TxHashCallbackFn | undefined, confirmations?: number) => Promise<string>;
