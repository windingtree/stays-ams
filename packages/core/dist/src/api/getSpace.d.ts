import type { EthRioStays } from 'stays-smart-contracts';
import type { Space } from 'stays-data-models';
import type { Web3StorageApi } from '@windingtree/ipfs-apis';
export declare const getSpace: (contract: EthRioStays, web3Storage: Web3StorageApi, spaceId: string) => Promise<Space | null>;
