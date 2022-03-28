import type { Stays } from 'stays-smart-contracts';
import type { Space } from 'stays-data-models';
import type { Web3StorageApi } from '@windingtree/ipfs-apis';
export declare const getSpace: (contract: Stays, web3Storage: Web3StorageApi, spaceId: string) => Promise<Space | null>;
