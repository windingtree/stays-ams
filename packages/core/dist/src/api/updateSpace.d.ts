import type { Stays } from 'stays-smart-contracts';
import type { SpaceRaw } from 'stays-data-models';
import type { Web3StorageApi } from '@windingtree/ipfs-apis';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
export declare const updateSpace: (contract: Stays, web3Storage: Web3StorageApi, spaceId: string, profileData: SpaceRaw, overrides?: MethodOverrides | undefined, transactionHashCb?: TxHashCallbackFn | undefined, confirmations?: number) => Promise<string>;
