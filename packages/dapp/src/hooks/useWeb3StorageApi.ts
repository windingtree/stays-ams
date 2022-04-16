import { useMemo } from 'react';
import { Web3StorageApi } from '@windingtree/ipfs-apis';
import { getApiKey } from '../config';

export const useWeb3StorageApi = (): Web3StorageApi => useMemo(
  () => new Web3StorageApi(getApiKey('web3Storage')),
  []
);
