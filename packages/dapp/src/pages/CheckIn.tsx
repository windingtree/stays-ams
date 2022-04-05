import React, { useCallback, useMemo, useState } from 'react';
import { Box, Spinner } from 'grommet';
import { PageWrapper } from "./PageWrapper";
import { QrReader } from '../components/QrReader';
import { useAppState } from '../store';
import { useContract } from '../hooks/useContract';
import { MessageBox } from '../components/MessageBox';
import { StaysVoucher } from 'stays-smart-contracts';
import { getNetwork } from '../config';
import { ExternalLink } from '../components/ExternalLink';
import { centerEllipsis } from '../utils/strings';

export const CheckIn = (): JSX.Element => {
  const {
    isBootstrapLoading,
    isIpfsNodeConnecting,
    provider,
    ipfsNode,
    bootstrapped
  } = useAppState();

  const [contract, loadingContract] = useContract(provider, ipfsNode);

  const [hash, setHash] = useState('');
  const hashLink = useMemo(() => {
    const network = getNetwork()
    return hash ? `${network.blockExplorer}/tx/${hash}` : null
  }, [hash]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleCheckIn = useCallback(
    async (data: string) => {
      try {
        setLoading(true)
        if (!contract) {
          throw new Error('Contract is not connected');
        }
        setError(undefined);

        const parsedData: StaysVoucher = JSON.parse(data)
        await contract.checkIn(
          parsedData.tokenId,
          parsedData,
          undefined,
          setHash,
          undefined
        )
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError((error as Error).message);

      }
    }, [contract, setError, setLoading, setHash])

  return (
    <>
      <PageWrapper
        breadcrumbs={[
          {
            path: "/",
            label: "Home",
          },
        ]}
      >
        <MessageBox type='info' show={isIpfsNodeConnecting || isBootstrapLoading || loadingContract}>
          <Box direction='row'>
            <Box>
              The Dapp is synchronizing with the smart contract. Please wait..&nbsp;
            </Box>
            <Spinner />
          </Box>
        </MessageBox>

        <MessageBox type='error' show={!!error}>
          <Box direction='row'>
            <Box>
              {error}
            </Box>
          </Box>
        </MessageBox>

        {(!!bootstrapped && !!contract) &&
          <Box
            alignSelf="center"
            style={{
              paddingBottom: 50,
              width: "100%",
            }}
          >
            <QrReader onError={setError} onScan={handleCheckIn} />
            {hashLink !== null ?
              <ExternalLink href={hashLink} label={centerEllipsis(hash)} />
              : null}

            {loading ? <Spinner color='accent-1' alignSelf='center' size='medium' /> : null}
          </Box>
        }
      </PageWrapper>
    </>
  );
};
