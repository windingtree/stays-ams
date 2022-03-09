import type { BigNumber, providers } from 'ethers';
import type { CryptoCossacks2022 as CCBaseContract } from '@crypto-cossacks/token/typechain';
import type { MethodOverrides, TxHashCallbackFn } from './utils/sendHelper';
import type { TokenData } from './types';
export declare type KnownProvider = providers.ExternalProvider | providers.JsonRpcProvider | providers.Web3Provider | providers.Provider | string;
export declare class CCContract {
    readonly address: string;
    readonly provider: providers.Provider;
    readonly contract: CCBaseContract;
    constructor(contractAddress: string, providerOrUri: KnownProvider);
    getTokenById(tokenId: number | string | BigNumber): Promise<TokenData | null>;
    getTokenMetadataById(tokenId: number | string | BigNumber): Promise<TokenData | null>;
    isTokenMintable(tokenId: number | string | BigNumber): Promise<boolean>;
    getOwnedTokens(ownerAddress: string): Promise<TokenData[] | []>;
    mintToken(tokenId: number | string, overrides: MethodOverrides, transactionHashCb: TxHashCallbackFn, confirmations: number): Promise<TokenData>;
    isPaused(): Promise<boolean>;
    getPrice(): Promise<BigNumber>;
    estimateMinting(tokenId: number | string): Promise<BigNumber>;
    isFounder(): Promise<boolean>;
    getNickName(tokenId: number | string): Promise<string>;
}
