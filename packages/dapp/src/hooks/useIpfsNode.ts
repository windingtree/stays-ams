import type { IPFS, Options as IpfsOptions } from '@windingtree/ipfs-apis';
import { useState, useCallback, useEffect } from 'react';
import { utils } from '@windingtree/ipfs-apis';

export type UseIpfsNode = [
  node: IPFS | undefined,
  start: Function,
  stop: Function,
  loading: boolean,
  error: string | undefined,
];

// useIpfsNode react hook
export const useIpfsNode = (): UseIpfsNode => {
  const [node, setNode] = useState<IPFS | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const start = useCallback(async (options?: IpfsOptions): Promise<IPFS | undefined> => {
    try {
      setLoading(true);
      const ipfsNode = await utils.startIpfsGateway(options);
      setNode(ipfsNode);
      setLoading(false);
      return ipfsNode;
    } catch (e) {
      setError((e as Error).message || 'Unknown useIpfsNode error');
      setLoading(false);
    }
  }, []);

  const doStop = async (ipfsNodePromise: Promise<IPFS | undefined>): Promise<void> => {
    const ipfsNode = await (ipfsNodePromise || Promise.resolve());

    if (ipfsNode !== undefined) {
      await ipfsNode.stop();
    }
  };

  const stop = useCallback(async (): Promise<void> => {
    if (node !== undefined) {
      try {
        setLoading(true);
        await doStop(Promise.resolve(node));
        setNode(undefined);
        setLoading(false);
      } catch (e) {
        setError((e as Error).message || 'Unknown useIpfsNode error');
        setLoading(false);
      }
    }
  }, [node]);

  useEffect(() => {
    const ipfsNodePromise = start();
    return () => {
      doStop(ipfsNodePromise);
    };
  }, [start]);

  return [node, start, stop, loading, error];
};
