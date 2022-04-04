import type { StayToken } from 'stays-core';
import React, { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import * as Icons from 'grommet-icons';
import { Grid, Button, Box, Card, CardBody, CardHeader, CardFooter, Image, Text, Spinner } from 'grommet';
import { centerEllipsis } from '../../utils/strings';
import { TxHashCallbackFn } from 'stays-core/dist/src/utils/sendHelper';
import { getNetwork } from '../../config';
import { ExternalLink } from '../ExternalLink';
import styled from 'styled-components';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;


export interface CheckOutProps extends StayToken {
  getDate: (days: number) => DateTime;
  isGetDateReady: boolean;
  facilityOwner: string | undefined;
  checkOut: (
    tokenId: string,
    transactionHashCb?: TxHashCallbackFn
  ) => void;
  onClose: () => void;
}

export const CheckOutView = ({
  tokenId,
  getDate,
  isGetDateReady,
  status,
  data: {
    name,
    description,
    image,
    attributes
  },
  checkOut,
  onClose
}: CheckOutProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const [hash, setHash] = useState('');

  const hashLink = useMemo(() => {
    const network = getNetwork()
    return hash ? `${network.blockExplorer}/tx/${hash}` : null
  }, [hash])

  const handleCheckOut = () => {
    setLoading(true);
    try {
      const startDay = attributes?.find(attr => attr.trait_type === 'startDay')
      const numberOfDays = attributes?.find(attr => attr.trait_type === 'numberOfDays')
      const now = DateTime.now()
      const checkOutDate = getDate(Number(numberOfDays) + Number(startDay))
      if (now.toMillis() < checkOutDate.toMillis()) {
        throw new Error(`Checkout not available yet (check out date: ${checkOutDate.toLocaleString()} )`)
      }

      checkOut(tokenId, setHash)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error) {
        setError((error as Error).message);
      } else {
        setError('Unknown handleCheckOut error');
      }
    }
  }

  const parseTrait = (trait: string, value: any): any => {
    switch (trait) {
      case 'startDay':
        return getDate(Number(value)).toISODate();
      case 'facilityId':
        return centerEllipsis(value);
      case 'spaceId':
        return centerEllipsis(value);
      default:
        return value;
    }
  };

  if (!isGetDateReady) {
    return null;
  }

  return (
    <Box
      alignSelf='center'
      direction='column'
      pad={{ bottom: 'medium' }}
    >
      <Card
        width='large'
      >
        <CardBody>
          <CardHeader
            pad={{ horizontal: 'small' }}
            background='light-2'
            justify='end'
          >
            <Button
              icon={<Icons.Close color="plain" />}
              hoverIndicator
              onClick={() => onClose()}
            />
          </CardHeader>
          <Image
            fit='cover'
            src={image}
          />
          <Grid
            fill='horizontal'
            pad='small'
            border='bottom'
            columns={['small', 'auto']}
            responsive
          >
            <Box>
              <Text weight='bold'>Status</Text>
            </Box>
            <Box>
              <Text>{status ?? 'unknown'}</Text>
            </Box>
          </Grid>
          <Grid
            fill='horizontal'
            pad='small'
            border='bottom'
            columns={['small', 'auto']}
            responsive
          >
            <Box>
              <Text weight='bold'>Name</Text>
            </Box>
            <Box>
              <Text>{name}</Text>
            </Box>
          </Grid>
          <Grid
            fill='horizontal'
            pad='small'
            border='bottom'
            columns={['small', 'auto']}
            responsive
          >
            <Box>
              <Text weight='bold'>Description</Text>
            </Box>
            <Box>
              <Text>{description}</Text>
            </Box>
          </Grid>

          {attributes?.map(
            ({ trait_type, value }, index) => (
              <Grid
                key={index}
                fill='horizontal'
                pad='small'
                border='bottom'
                columns={['small', 'auto']}
                responsive
              >
                <Box>
                  <Text weight='bold'>{trait_type}</Text>
                </Box>
                <Box>
                  <Text>{parseTrait(trait_type, value)}</Text>
                </Box>
              </Grid>
            )
          )}
        </CardBody>
        <CardFooter pad='medium'>
          <Button onClick={() => handleCheckOut()} >
            {() => (
              <Box direction='row' align='center' pad='small'>
                <Text>
                  Check out
                </Text>
                {loading && <InnerSpinner />}
              </Box>
            )}
          </Button>
          {hashLink !== null ?
            <ExternalLink href={hashLink} label={centerEllipsis(hash)} />
            : null}
          {/* <MessageBox type='info' show={!!error}>
            <Box direction='row'>
              <Box>
                {error}
              </Box>
            </Box>
          </MessageBox> */}
        </CardFooter>
      </Card>

      {/* <MessageBox type='error' show={!!error}>
        <Box>
          {error}
        </Box>
      </MessageBox> */}
    </Box>
  );
};
