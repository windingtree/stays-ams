import type { providers } from 'ethers';
import type { TypedDataField } from '@ethersproject/abstract-signer';
import type { StaysVoucher } from 'stays-smart-contracts';
import { createVoucher } from 'stays-smart-contracts';
import { useMemo, useCallback } from 'react';
import { getNetwork } from '../config';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useSignVoucher');

const network = getNetwork();

export { TypedDataField }

export type UseSignTypedDataHook = [
  signCallback: (from: string, to: string, tokenId: string) => Promise<StaysVoucher>,
  isReady: boolean
];

export const useSignVoucher = (
  provider: providers.JsonRpcProvider | undefined
): UseSignTypedDataHook => {
  const isReady = useMemo(() => !!provider, [provider]);

  const signCallback = useCallback(
    async (from: string, to: string, tokenId: string): Promise<StaysVoucher> => {
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

      const voucher = createVoucher(
        signer,
        from,
        to,
        tokenId,
        network.address,
        network.chainId
      );
      logger.debug('Voucher', voucher);

      return voucher;
    },
    [provider]
  );

  return [signCallback, isReady];
};
