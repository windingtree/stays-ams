import type { Signer } from 'ethers';
export declare const createVoucher: (signer: Signer, from: string, to: string, tokenId: string, verifyingContract: string, chainId: number) => Promise<{
    signature: string;
    from: string;
    to: string;
    tokenId: string;
}>;
