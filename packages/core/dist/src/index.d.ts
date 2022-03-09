import type { providers } from 'ethers';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { LodgingFacility, Space } from 'stays-data-models';
import type { EthRioStays } from 'stays-smart-contracts';
export declare type KnownProvider = providers.ExternalProvider | providers.JsonRpcProvider | providers.Web3Provider | providers.Provider | string;
export declare class EthRioContract {
    readonly address: string;
    readonly provider: providers.Provider;
    readonly contract: EthRioStays;
    readonly ipfsNode: IPFS;
    constructor(contractAddress: string, providerOrUri: KnownProvider, ipfsNode: IPFS);
    getLodgingFacilityIds(active: boolean): Promise<string[]>;
    getSpaceIds(lodgingFacilityId: string, active: boolean): Promise<string[]>;
    getAvailability(spaceId: string, startDay: number, numberOfDays: number): Promise<number[]>;
    getLodgingFacility(lodgingFacilityId: string): Promise<LodgingFacility | null>;
    getSpace(spaceId: string): Promise<Space | null>;
}
