import type { providers } from 'ethers';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { Web3ModalProvider } from './useWeb3Modal';
import { useState, useEffect } from 'react';
import { KnownProvider } from 'stays-core';
import { EthRioContract } from 'stays-core';
import { getNetwork } from '../config';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useContract');

export type UseContractHook = [
  contract: EthRioContract | undefined,
  loading: boolean,
  error: string | undefined
];

const { address } = getNetwork();

export const useContract = (
  provider: providers.JsonRpcProvider | Web3ModalProvider | undefined,
  ipfsNode: IPFS | undefined,
): UseContractHook => {
  const [contract, setContract] = useState<EthRioContract | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!provider || !ipfsNode) {
      return;
    }

    try {
      setContract(
        new EthRioContract(
          address,
          provider as KnownProvider,
          ipfsNode
        )
      );
    } catch (error) {
      logger.error(error);
      const message = (error as Error).message || 'Unknown contract library error';
      setError(message);
      setLoading(false);
    }
  }, [provider, ipfsNode]);

  return [contract, loading, error];
};
