import { useState, useMemo } from 'react';
import { providers } from 'ethers';
import { getNetwork } from '../config';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useRpcProvider');

const { rpc } = getNetwork();

export type UseRpcProviderHook = [
  rpcProvider: providers.JsonRpcProvider,
  error: string | undefined
];

export const useRpcProvider = (): UseRpcProviderHook => {
  const [error, setError] = useState<string | undefined>();

  const rpcProvider = useMemo(() => new providers.JsonRpcProvider(rpc), []);
  rpcProvider.on('error', error => {
    logger.error(error);
    const message = (error as Error).message || 'Unknown JsonRpcProvider error';
    setError(message);
  })

  return [rpcProvider, error];
};