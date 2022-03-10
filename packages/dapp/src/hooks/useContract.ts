import type { IPFS } from '@windingtree/ipfs-apis';
import type { Web3ModalProvider } from './useWeb3Modal';
import { useState, useEffect } from 'react';
import { KnownProvider } from 'stays-core';
import { EthRioContract } from 'stays-core';
import { getContractAddress } from '../config';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useContract');

export type UseContractHook = [
  contract: EthRioContract | undefined,
  loading: boolean,
  error: string | undefined
];

export const useContract = (
  provider: Web3ModalProvider | undefined,
  ipfsNode: IPFS | undefined,
  networkId: number | undefined
): UseContractHook => {
  const [contract, setContract] = useState<EthRioContract | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!provider || !ipfsNode || !networkId) {
      return;
    }

    try {
      const instance = new EthRioContract(
        getContractAddress(networkId),
        provider as KnownProvider,
        ipfsNode
      );
      setContract(instance);
    } catch (error) {
      setLoading(false);

      if (error) {
        logger.error(error);
        setError((error as Error).message);
      } else {
        logger.error('Unknown lodging facility loader error');
      }
    }
  }, [provider, ipfsNode, networkId]);

  return [contract, loading, error];
};
