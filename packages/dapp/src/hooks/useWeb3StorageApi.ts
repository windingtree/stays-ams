import type { IPFS } from '@windingtree/ipfs-apis';
import { useMemo } from 'react';
import { Web3StorageApi } from '@windingtree/ipfs-apis';
import { getApiKey } from '../config';

export const useWeb3StorageApi = (
  ipfsNode: IPFS | undefined
): Web3StorageApi | undefined => useMemo(
  () => !!ipfsNode
    ? new Web3StorageApi(getApiKey('web3Storage'), ipfsNode)
    : undefined,
  [ipfsNode]
);
