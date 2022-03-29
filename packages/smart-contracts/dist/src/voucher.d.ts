import type { Signer } from 'ethers';
export interface StaysVoucher {
    from: string;
    to: string;
    tokenId: string;
    signature: string;
}
export declare const createVoucher: (signer: Signer, from: string, to: string, tokenId: string, verifyingContract: string, chainId: number) => Promise<{
    signature: string;
    from: string;
    to: string;
    tokenId: string;
}>;
