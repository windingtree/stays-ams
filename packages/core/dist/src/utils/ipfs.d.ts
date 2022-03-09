import type { IPFS } from '@windingtree/ipfs-apis';
export declare const ipfsCidResolver: (ipfsNode: IPFS) => (cid: string) => Promise<any>;
