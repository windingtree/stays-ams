import type { IProviderInfo, IProviderControllerOptions } from 'web3modal';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3modal from 'web3modal';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useWeb3Modal');

export type Web3ModalConfig = Partial<IProviderControllerOptions>;

export type Web3ModalProvider = ethers.providers.Web3Provider;

export type  Web3ModalHook = [
  provider: Web3ModalProvider | undefined,
  injectedProvider: IProviderInfo | undefined,
  isConnecting: boolean,
  signIn: Function,
  signOut: Function,
  error: string | null
];

// Web3Modal React Hook
export const useWeb3Modal = (web3ModalConfig: Web3ModalConfig): Web3ModalHook => {
  const [provider, setProvider] = useState<Web3ModalProvider | undefined>();
  const [injectedProvider, setInjectedProvider] = useState<IProviderInfo | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Web3Modal initialization
  const web3Modal = useMemo(
    () => new Web3modal(web3ModalConfig),
    [web3ModalConfig]
  );

  const signOut = useCallback(() => {
    web3Modal.clearCachedProvider();
    setProvider(undefined);
    // SignOut issue when using walletconnect: https://github.com/Web3Modal/web3modal/issues/354
    logger.info(`Logged Out`);
    // window.location.reload();
  }, [web3Modal]);

  const signIn = useCallback(async () => {
    try {
      setError(null);
      setIsConnecting(true);

      setInjectedProvider(
        (web3Modal as any).providerController.cachedProvider === 'injected'
          ? (web3Modal as any).providerController.injectedProvider
          : undefined
      );

      const updateProvider = async () => {
        const web3ModalProvider = await web3Modal.connect();

        // Subscribe to provider events compatible with EIP-1193 standard
        // Subscribe to accounts change
        web3ModalProvider.on('chainChanged', (chainId: number) => {
          logger.info(`Chain changed: ${chainId}`);
          updateProvider();
        });

        // Subscribe to chainId change
        web3ModalProvider.on('accountsChanged', () => {
          logger.info(`Accounts changed`);
          updateProvider();
        });

        // Subscribe to provider disconnection
        web3ModalProvider.on('disconnect', (code: number, reason: string) => {
          logger.info(`Disconnected with code: ${code} and reason: ${reason}`);
          signOut();
        });

        setProvider(
          new ethers.providers.Web3Provider(web3ModalProvider)
        );
      };

      updateProvider();

      logger.info(`Logged In`);
    } catch (error) {
      setIsConnecting(false);

      if (error) {
        logger.error(error);
        setError((error as Error).message);
      } else {
        logger.error('Unknown error');
      }
    }
  }, [web3Modal, signOut]);

  useEffect(() => {
    if (!provider && web3Modal.cachedProvider) {
      signIn();
    } else if (provider) {
      setTimeout(() => setIsConnecting(false), 250);
    }
  }, [provider, web3Modal.cachedProvider, signIn]);

  return [
    provider,
    injectedProvider,
    isConnecting,
    signIn,
    signOut,
    error
  ];
};
