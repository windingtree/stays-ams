import type { Signer, providers } from 'ethers';

export interface StaysVoucher {
  from: string;
  to: string;
  tokenId: string;
  signature: string;
}

export const createVoucher = async (
  signer: Signer,
  from: string,
  to: string,
  tokenId: string,
  verifyingContract: string,
  chainId: number
) => {
  const voucher = {
    from,
    to,
    tokenId
  };
  const domain = {
    name: 'Stays',
    version: '1',
    chainId,
    verifyingContract
  };
  const types = {
    Voucher: [
      {
        name: 'from',
        type: 'address'
      },
      {
        name: 'to',
        type: 'address'
      },
      {
        name: 'tokenId',
        type: 'uint256'
      }
    ]
  };

  const signature = await (signer as providers.JsonRpcSigner)._signTypedData(domain, types, voucher);

  return {
    ...voucher,
    signature,
  }
}
