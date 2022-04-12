import type { providers } from 'ethers';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { Web3ModalProvider } from './useWeb3Modal';
import { useState, useEffect } from 'react';
import { KnownProvider } from 'stays-core';
import { Contract } from 'stays-core';
import { getNetwork } from '../config';
import { useWeb3StorageApi } from './useWeb3StorageApi';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useContract');

export type UseContractHook = [
  contract: Contract | undefined,
  loading: boolean,
  error: string | undefined,
];

const { address } = getNetwork();

export const useContract = (
  provider: providers.JsonRpcProvider | Web3ModalProvider | undefined,
  ipfsNode: IPFS | undefined,
  withSigner = true
): UseContractHook => {
  const web3Storage = useWeb3StorageApi(ipfsNode);
  const [contract, setContract] = useState<Contract | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    if (!provider || !web3Storage) {
      return;
    }

    try {
      setContract(
        new Contract(
          address,
          provider as KnownProvider,
          web3Storage,
          withSigner
        )
      );
      setLoading(false);
    } catch (error) {
      logger.error(error);
      const message = (error as Error).message || 'Unknown contract library error';
      setError(message);
      setLoading(false);
    }
  }, [provider, web3Storage, withSigner]);

  return [contract, loading, error];
};
