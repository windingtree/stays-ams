import type { StayToken } from 'stays-core';
import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { Grid, Button, Box, Text, Spinner } from 'grommet';
import { centerEllipsis } from '../../utils/strings';
import { TxHashCallbackFn } from 'stays-core/dist/src/utils/sendHelper';
import { getNetwork } from '../../config';
import { ExternalLink } from '../ExternalLink';
import styled from 'styled-components';
import { MessageBox } from '../MessageBox';
import { CustomText } from '../StayVoucherQr';
import { getDate } from '../../utils/dates';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;

const BlackButton = styled(Button)`
  color: #fff;
  background: #0D0E0F;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  // max-height: 3rem;
  border-radius: 2rem;
  border: none;
  width: 8rem
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
  error
}: CheckOutProps) => {
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

  return (
    <Box
      alignSelf='center'
      direction='row'
      align='center'
      justify='start'
      // pad={{ bottom: 'medium' }}
      fill
    >
      <Grid
        fill='horizontal'
        // pad='small'
        align='center'
        columns={['medium', 'small', 'auto']}
        responsive
      >
        <Box>
          <CustomText>{name}</CustomText>
        </Box>
        <Box>
          <CustomText>{status ?? 'unknown'}</CustomText>
        </Box>
        <Box>
          <CustomText>{getDate(parseTrait('startDay')).toISODate()} - {getDate(Number(parseTrait('startDay')) + Number(parseTrait('numberOfDays'))).toISODate()}</CustomText>
        </Box>
      </Grid>

      <Box pad='medium'>
        <BlackButton onClick={() => checkOut(tokenId, checkOutDate, setHash)} >
          {() => (
            <Box direction='row' align='center' justify='center' pad='small'>
              <Text>
                Check out
              </Text>
              {loading && <InnerSpinner />}
            </Box>
          )}
        </BlackButton>
        {hashLink !== null ?
          <ExternalLink href={hashLink} label={centerEllipsis(hash)} />
          : null}
        <MessageBox type='error' show={!!error}>
          <Box direction='row'>
            <Box>
              {error}
            </Box>
          </Box>
        </MessageBox>
      </Box>
    </Box>
  );
};
