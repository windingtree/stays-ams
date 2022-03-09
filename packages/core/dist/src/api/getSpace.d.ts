import type { EthRioStays } from 'stays-smart-contracts';
import type { Space } from 'stays-data-models';
import type { IPFS } from '@windingtree/ipfs-apis';
export declare const getSpace: (contract: EthRioStays, ipfsNode: IPFS, spaceId: string) => Promise<Space | null>;
