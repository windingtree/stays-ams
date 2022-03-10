import type { EthRioStays } from 'stays-smart-contracts';
import type { LodgingFacilityRaw } from 'stays-data-models';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
export declare const registerLodgingFacility: (contract: EthRioStays, ipfsNode: IPFS, profileData: LodgingFacilityRaw, active?: boolean, fren?: string | undefined, overrides?: MethodOverrides | undefined, transactionHashCb?: TxHashCallbackFn | undefined, confirmations?: number) => Promise<string>;
