import type { providers } from 'ethers';
import type { TypedDataField } from '@ethersproject/abstract-signer';
import { useMemo, useCallback } from 'react';
import { getNetwork } from '../config';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useSignVoucher');

const network = getNetwork();

// The named list of all type definitions
export const types = {
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
      type: 'string'
    }
  ]
};

export { TypedDataField }

export type UseSignTypedDataHook = [
  signCallback: (from: string, to: string, tokenId: string) => Promise<string>,
  isReady: boolean
];

export const useSignVoucher = (
  provider: providers.JsonRpcProvider | undefined
): UseSignTypedDataHook => {
  const isReady = useMemo(() => !!provider, [provider]);

  const signCallback = useCallback(
    async (from: string, to: string, tokenId: string) => {
      if (!!!provider) {
        throw new Error('Signature provider is not ready yet');
      }

      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      if (from !== signerAddress) {
        throw new Error('The signer address and "from" address must be equal');
      }

      if (!to) {
        throw new Error('Stay voucher recipient not defined');
      }

      const domain = {
        name: 'Stays Voucher',
        version: '1',
        chainId: network.chainId,
        verifyingContract: network.address
      };
      logger.debug('domain', domain);

      const value = {
        from,
        to,
        tokenId
      };
      logger.debug('value', value);

      return signer._signTypedData(domain, types, value);
    },
    [provider]
  );

  return [signCallback, isReady];
};
