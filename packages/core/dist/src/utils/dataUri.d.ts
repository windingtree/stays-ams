import type { IPFS } from '@windingtree/ipfs-apis';
import type { TokenData } from '../types';
export declare type TokenUriType = 'http' | 'ipfs';
export declare const fetchDataUri: <DT>(ipfsNode: IPFS, uri: string) => Promise<DT>;
export declare const decodeDataUri: (dataUri: string, parse?: boolean) => TokenData | string;
