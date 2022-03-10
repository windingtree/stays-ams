import type { BigNumber } from 'ethers';
import type { EthRioStays } from 'stays-smart-contracts';
import type { SpaceRaw } from 'stays-data-models';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
export declare const addSpace: (contract: EthRioStays, ipfsNode: IPFS, profileData: SpaceRaw, lodgingFacilityId: string, capacity: number, pricePerNightWei: BigNumber, active?: boolean, overrides?: MethodOverrides | undefined, transactionHashCb?: TxHashCallbackFn | undefined, confirmations?: number) => Promise<string>;
