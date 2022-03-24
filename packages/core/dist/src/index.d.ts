import type { providers } from 'ethers';
import type { Web3StorageApi } from '@windingtree/ipfs-apis';
import type { LodgingFacilityRaw, LodgingFacility, SpaceRaw, Space } from 'stays-data-models';
import type { Stays } from 'stays-smart-contracts';
import type { MethodOverrides, TxHashCallbackFn } from './utils/sendHelper';
import type { StayToken } from './types';
export * from './types';
export declare type KnownProvider = providers.ExternalProvider | providers.JsonRpcProvider | providers.Web3Provider | providers.Provider | string;
export declare class Contract {
    readonly address: string;
    readonly provider: providers.Provider;
    readonly contract: Stays;
    readonly web3Storage: Web3StorageApi;
    constructor(contractAddress: string, providerOrUri: KnownProvider, web3Storage: Web3StorageApi);
    getDayZero(): Promise<number>;
    getLodgingFacilityIds(active: boolean): Promise<string[]>;
    getNewAndUpdatedFacilityIds(fromBlock: number): Promise<string[]>;
    getSpaceIds(lodgingFacilityId: string, active: boolean): Promise<string[]>;
    getAvailability(spaceId: string, startDay: number, numberOfDays: number): Promise<number[]>;
    getLodgingFacility(lodgingFacilityId: string): Promise<LodgingFacility | null>;
    getSpace(spaceId: string): Promise<Space | null>;
    getTokensOfOwner(owner: string): Promise<string[]>;
    getToken(tokenId: string): Promise<StayToken>;
    registerLodgingFacility(profileData: LodgingFacilityRaw, active?: boolean, fren?: string, // address
    overrides?: MethodOverrides, transactionHashCb?: TxHashCallbackFn, confirmations?: number): Promise<string>;
    addSpace(profileData: SpaceRaw, lodgingFacilityId: string, capacity: number, pricePerNightWei: string, active?: boolean, overrides?: MethodOverrides, transactionHashCb?: TxHashCallbackFn, confirmations?: number): Promise<string>;
    book(spaceId: string, startDay: number, numberOfDays: number, quantity: number, overrides?: MethodOverrides, transactionHashCb?: TxHashCallbackFn, confirmations?: number): Promise<string>;
}
