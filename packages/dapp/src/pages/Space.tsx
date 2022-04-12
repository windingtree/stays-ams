import { PageWrapper } from './PageWrapper';
import { Box, Text, Image, Carousel, Spinner, Grid } from 'grommet';
import { useAppState } from '../store';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { BookWithDai } from '../components/buttons/BookWithDai';
import { MessageBox } from '../components/MessageBox';
import { ExternalLink } from '../components/ExternalLink';
import * as Icons from 'grommet-icons';
import { getNetwork } from '../config';
import { centerEllipsis } from '../utils/strings';
import { useContract } from '../hooks/useContract';
import { NavLink } from 'react-router-dom';
import { utils, BigNumber as BN } from 'ethers';
import { Header } from './MyTokens';
// import { CustomText, Title } from '../components/StayVoucherQr';
import styled from 'styled-components';

export const Description = styled(Text)`
  color: #0D0E0F;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  text-align: start;
`;

export const Space: React.FC = () => {
  const {
    account,
    lodgingFacilities,
    searchSpaces,
    // themeMode,
    searchParams,
    provider,
    ipfsNode,
    bootstrapped
  } = useAppState();

  const query = window.location.pathname.substring(7);
  const space = useMemo(() => searchSpaces.find((space) => space.id === query), [searchSpaces, query]);
  const facility = useMemo(() => lodgingFacilities.find((facility) => {
    const space = facility.spaces.find((space => space.contractData.spaceId === query))
    if (space) {
      return true
    }
    return false
  }), [query, lodgingFacilities]);

  const [contract, , errorContract] = useContract(provider, ipfsNode);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [tokenId, setTokenId] = useState<string | undefined>();
  const [hash, setHash] = useState('');

  useEffect(() => {
    setError(errorContract);
  }, [errorContract]);

  const hashLink = useMemo(() => {
    const network = getNetwork()
    return hash ? `${network.blockExplorer}/tx/${hash}` : null
  }, [hash])

  const bookHandler = useCallback(
    async () => {
      try {
        setLoading(true)
        if (!contract) {
          throw new Error('Contract is not connected');
        }
        if (searchParams === undefined) {
          throw new Error('searchParams is undefined');
        }
        if (space === undefined) {
          throw new Error('space is undefined');
        }
        if (!account) {
          throw new Error('account is undefined');
        }
        if (!provider) {
          throw new Error('provider is undefined');
        }
        const balance = await provider.getBalance(account)
        const total = Number(utils.formatUnits(space.contractData.pricePerNightWei, 'ether')) * Number(searchParams.numberOfDays)

        if (Number(utils.formatUnits(balance, 'ether')) < total) {
          throw new Error('not enough DAI')
        }
        setError(undefined);

        const res = await contract.book(
          space.id,
          searchParams.startDay,
          searchParams.numberOfDays,
          searchParams.guestsAmount,
          undefined,
          setHash
        );
        setTokenId(res);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError((error as Error).message);
      }
    },
    [account, contract, provider, searchParams, space]
  );

  const isLoading = useMemo(() => !!bootstrapped && !!contract, [bootstrapped, contract]);

  const searchQuery = useMemo(() => {
    return new URLSearchParams([
      ['startDay', String(searchParams?.startDay)],
      ['numberOfDays', String(searchParams?.numberOfDays)],
      ['guestsAmount', String(searchParams?.guestsAmount)],
    ])
  }, [searchParams]);

  const numberDays = useMemo(
    () => searchParams?.numberOfDays || 1,
    [searchParams]
  );

  const guestsAmount = useMemo(
    () => searchParams?.guestsAmount || 1,
    [searchParams]
  );

  const getPrice = useCallback(
    (nights: number, guestsAmount: number): string  => {
      const perNight = BN.from(space?.contractData.pricePerNightWei ?? 0);
      return utils.formatUnits(
        perNight.mul(BN.from(nights)).mul(BN.from(guestsAmount)),
        'ether'
      );
    },
    [space]
  );

  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Search',
          path: `/search?${searchQuery}`
        }
      ]}
    >
      <MessageBox type='info' show={!isLoading}>
        <Box direction='row'>
          <Box>
            The Dapp is synchronizing with the smart contract. Please wait..&nbsp;
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      <MessageBox type='info' show={!!tokenId}>
        <Box direction='row'>
          <Box>
            Booked successfully!
            <NavLink to={`/tokens?tokenId=${tokenId}`}> Check details </NavLink>
          </Box>
        </Box>
      </MessageBox>

      {isLoading && !space && <Box> No space with given id </Box>}
      {isLoading && !!space && !tokenId &&
        <Box align='center' overflow='hidden'>
          <Image
            height='150'
            width='150'
            style={{ borderRadius: '50%' }}
            src={space.media.logo}
          />

          <Header> {space.name}</Header>

          {!!facility &&
            <Box align='center'>
              <Text size='large'>
                {facility.address.streetAddress}, {facility.address.postalCode} {facility.address.locality}, {facility.address.country}.
              </Text>
              <Text size='large'>
                {facility.contact?.email} {facility.contact?.website} {facility.contact?.phone}.
              </Text>
            </Box>
          }

          <Box
            fill
            align='center'
            pad={{ bottom: 'medium' }}
          >
            <Description>{space.description}</Description>
          </Box>

          <Box fill>
            <Box border='bottom' pad={{ bottom: 'small' }} direction='row'>
              <Text size='xxlarge' weight='bold'>Room type</Text>
            </Box>
            <Grid
              pad={{ vertical: 'medium' }}
              columns={['1/2', '1/2']}
            >
              <Box direction='row' align='center'>
                <Icons.Checkmark style={{ border: '1px solid #0D0E0F', borderRadius: '50%', padding: '0.3rem', marginRight: '0.5rem' }} color='#000' />
                <Text size='large'>{space.type} </Text>
              </Box>
            </Grid>
          </Box>

          <Box fill align='center' margin={{ bottom: 'xlarge' }}>
            <Carousel height='large' width='xlarge'>
              {space.media.images?.map((space, i) =>
                <Image
                  key={i}
                  width='xlarge'
                  fit="cover"
                  alignSelf='center'
                  src={space.uri}
                />
              )}
            </Carousel>
          </Box>

          <Box fill direction='row' justify='between' >
            <Box direction='row' align='center'>
              <Text size='xxlarge' weight='bold'>Price:&nbsp;</Text>
              <Text color='black' size='xxlarge'>
                {getPrice(numberDays, guestsAmount)}&nbsp;DAI
              </Text>
            </Box>
            <Box align='center'>
              <BookWithDai
                onClick={bookHandler}
                loading={loading}
                disabled={!!tokenId}
              />

              {hashLink !== null ?
                <ExternalLink href={hashLink} label={centerEllipsis(hash)} />
                : null}
            </Box>
          </Box>

          <Box fill pad={{ top: 'medium' }}>
            <MessageBox type='error' show={!!error}>
              <Box direction='row'>
                <Box>
                  {error}
                </Box>
              </Box>
            </MessageBox>
          </Box>
        </Box>
      }
    </PageWrapper>
  );
};
