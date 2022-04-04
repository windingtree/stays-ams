import type { StayToken } from 'stays-core';
import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import * as Icons from 'grommet-icons';
import { Grid, Button, Box, Card, CardBody, CardHeader, CardFooter, Image, Text, Spinner } from 'grommet';
import { centerEllipsis } from '../../utils/strings';
import { TxHashCallbackFn } from 'stays-core/dist/src/utils/sendHelper';
import { getNetwork } from '../../config';
import { ExternalLink } from '../ExternalLink';
import styled from 'styled-components';
import { MessageBox } from '../MessageBox';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;


export interface CheckOutProps extends StayToken {
  getDate: (days: number) => DateTime;
  // isGetDateReady: boolean;
  facilityOwner: string | undefined;
  proceedCheckOut: (
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
  getDate,
  // isGetDateReady,
  status,
  data: {
    name,
    description,
    image,
    attributes
  },
  proceedCheckOut,
  onClose,
  loading,
  error
}: CheckOutProps) => {
  const startDay = attributes?.find(attr => attr.trait_type === 'startDay')
  const numberOfDays = attributes?.find(attr => attr.trait_type === 'numberOfDays')
  const checkOutDate = getDate(Number(numberOfDays) + Number(startDay))

  const [hash, setHash] = useState('');
  const hashLink = useMemo(() => {
    const network = getNetwork()
    return hash ? `${network.blockExplorer}/tx/${hash}` : null
  }, [hash])

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

  // if (!isGetDateReady) {
  //   return null;
  // }

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
          <Button onClick={() => proceedCheckOut(tokenId, checkOutDate, setHash)} >
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
          <MessageBox type='error' show={!!error}>
            <Box direction='row'>
              <Box>
                {error}
              </Box>
            </Box>
          </MessageBox>
        </CardFooter>
      </Card>
    </Box>
  );
};
