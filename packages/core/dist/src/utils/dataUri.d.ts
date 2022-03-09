import type { IPFS } from '@windingtree/ipfs-apis';
export declare type TokenUriType = 'http' | 'ipfs';
export declare const fetchDataUri: <DT>(ipfsNode: IPFS, uri: string) => Promise<DT>;
