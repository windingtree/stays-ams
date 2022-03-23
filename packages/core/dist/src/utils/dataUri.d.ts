import type { Web3StorageApi } from '@windingtree/ipfs-apis';
import type { TokenData } from '../types';
export declare type TokenUriType = 'http' | 'ipfs';
export declare const fetchDataUri: <DT>(web3Storage: Web3StorageApi, uri: string) => Promise<DT>;
export declare const decodeDataUri: (dataUri: string, parse?: boolean) => TokenData | string;
