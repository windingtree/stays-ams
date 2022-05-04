import type { StayToken } from 'stays-core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { Grid, Box, Text, Spinner } from 'grommet';
import { centerEllipsis } from '../../utils/strings';
import { TxHashCallbackFn } from 'stays-core/dist/src/utils/sendHelper';
import { getNetwork } from '../../config';
import { ExternalLink } from '../ExternalLink';
import styled from 'styled-components';
import { MessageBox } from '../MessageBox';
import { CustomText, StayVoucherQr } from '../StayVoucherQr';
import { getDate } from '../../utils/dates';
import { providers } from 'ethers';
import { LodgingFacilityRecord } from '../../store/actions';
import { usePoller } from '../../hooks/usePoller';
import { useContract } from '../../hooks/useContract';
import { useAppState } from '../../store';
import { CustomButton } from '../search/SearchResultCard';
import { useWindowsDimension } from '../../hooks/useWindowsDimension';

export const ResponsiveColumn = (winWidth: number) => {
  if (winWidth >= 1300) {
    return ['medium', 'small', 'auto', '10rem'];
  } else if (winWidth >= 1000) {
    return ['medium', 'small', 'auto', '10rem'];
  } else if (winWidth >= 768) {
    return ['medium', 'small', 'auto', '10rem'];
  } else if (winWidth >= 600) {
    return ['auto'];
  } else if (winWidth <= 500) {
    return ['auto'];
  } else if (winWidth <= 400) {
    return ['auto'];
  }
};

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;

export interface CheckOutProps extends StayToken {
  facilityOwner: string | undefined;
  checkOut: (
    tokenId: string,
    checkOutDate: DateTime,
    transactionHashCb?: TxHashCallbackFn
  ) => void;
  onClose: () => void;
  loading: boolean;
  error: string | undefined;
  provider: providers.Web3Provider | undefined;
  facility: LodgingFacilityRecord
}

export const CheckOutView = ({
  tokenId,
  status,
  data: {
    name,
    description,
    image,
    attributes
  },
  checkOut,
  onClose,
  loading,
  error,
  owner,
  provider,
  facility,
  facilityOwner,
}: CheckOutProps) => {
  const { winWidth } = useWindowsDimension();
  const { rpcProvider, ipfsNode } = useAppState();
  const [contract] = useContract(rpcProvider, ipfsNode, false);

  const startDay = attributes?.find(attr => attr.trait_type === 'startDay')
  const numberOfDays = attributes?.find(attr => attr.trait_type === 'numberOfDays')
  const checkOutDate = getDate(Number(numberOfDays?.value) + Number(startDay?.value))

  const [hash, setHash] = useState('');
  const hashLink = useMemo(() => {
    const network = getNetwork()
    return hash ? `${network.blockExplorer}/tx/${hash}` : null
  }, [hash])

  const parseTrait = (trait: string): any => {
    return attributes?.find(attr => attr.trait_type === trait)?.value ?? ''
  };
  const [pollerEnabled, setPollerEnabled] = useState(false);
  const [tokenStatus, setTokenStatus] = useState(status);
  const [errorEnabled, setErrorEnabled] = useState(false);
  const [qrError, setQrError] = useState<string>();

  useEffect(() => {
    setPollerEnabled(true)
    return () => {
      setPollerEnabled(false)
    }
  }, [])

  const updateTokenState = useCallback(async () => {
    try {
      if (!contract) {
        return
      }
      const { status } = await contract.getToken(tokenId)
      setTokenStatus(status)
    } catch (e) {

    }
    console.log('TEST')
  }, [tokenId, contract])

  usePoller(
    updateTokenState,
    pollerEnabled && !!contract,
    20000,
    'updateTokenState'
  );

  return (
    <Box
      alignSelf='center'
      direction='column'
      fill
    >
      <Grid
        fill='horizontal'
        align='center'
        columns={ResponsiveColumn(winWidth)}
        responsive
      >
        <Box>
          <CustomText>{name}</CustomText>
        </Box>
        <Box>
          <CustomText>{tokenStatus ?? 'unknown'}</CustomText>
        </Box>
        <Box>
          <CustomText>{getDate(parseTrait('startDay')).toFormat('MM.dd.yyyy')}-{getDate(Number(parseTrait('startDay')) + Number(parseTrait('numberOfDays'))).toFormat('MM.dd.yyyy')}</CustomText>
        </Box>
        <Box pad={{ vertical: 'small' }}>
          {tokenStatus === 'booked' ?
            <StayVoucherQr
              provider={provider}
              from={facilityOwner}// facility owner adress
              to={owner}// stay token owner adress
              tokenId={tokenId}
              onError={err => setQrError(err)}
              name={name}
              description={description}
              attributes={attributes}
              facility={facility}
              pricePerNightWei={'0'}
            />
            : null}
          <CustomButton
            onClick={() => {
              checkOut(tokenId, checkOutDate, setHash)
              setErrorEnabled(true)
            }}
            disabled={checkOutDate.toMillis() > DateTime.now().toMillis()}
          >
            {() => (
              <Box>
                <Text size='1rem'>
                  Check out
                </Text>
                {loading && <InnerSpinner />}
              </Box>
            )}
          </CustomButton>

          {hashLink !== null ?
            <ExternalLink href={hashLink} label={centerEllipsis(hash)} />
            : null}
        </Box>
      </Grid>

      <MessageBox type='error' show={!!qrError}>
        <Box direction='row'>
          <Box>
            {qrError}
          </Box>
        </Box>
      </MessageBox>

      {errorEnabled &&
        <MessageBox type='error' show={!!error}>
          <Box direction='row'>
            <Box>
              {error}
            </Box>
          </Box>
        </MessageBox>
      }
    </Box>
  );
};
