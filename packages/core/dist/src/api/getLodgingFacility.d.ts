import type { EthRioStays } from 'stays-smart-contracts';
import type { LodgingFacility } from 'stays-data-models';
import type { IPFS } from '@windingtree/ipfs-apis';
export declare const getLodgingFacility: (contract: EthRioStays, ipfsNode: IPFS, lodgingFacilityId: string) => Promise<LodgingFacility | null>;
