import type { Web3StorageApi } from '@windingtree/ipfs-apis';
export declare const ipfsCidResolver: (web3Storage: Web3StorageApi) => (cid: string) => Promise<any>;
