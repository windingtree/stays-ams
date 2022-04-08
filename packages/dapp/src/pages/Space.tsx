import { PageWrapper } from './PageWrapper';
import { Box, Text, Image, Carousel, Spinner, Grid } from 'grommet';
import { useAppState } from '../store';
import { useMemo, useEffect, useState } from 'react';
import { ThemeMode } from '../components/SwitchThemeMode';
import { BookWithDai } from '../components/buttons/BookWithDai';
import { MessageBox } from '../components/MessageBox';
import { ExternalLink } from '../components/ExternalLink';
import * as Icons from 'grommet-icons';
import { getNetwork } from '../config';
import { centerEllipsis } from '../utils/strings';
import { useContract } from '../hooks/useContract';
import { NavLink } from 'react-router-dom';
import { utils } from 'ethers'
import { Header } from './MyTokens';
import { CustomText, Title } from '../components/StayVoucherQr';
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
    themeMode,
    searchParams,
    provider,
    ipfsNode,
    bootstrapped
  } = useAppState();

  const query = window.location.pathname.substring(7)
  const space = useMemo(() => searchSpaces.find((space) => space.id === query), [searchSpaces, query])
  const facility = useMemo(() => lodgingFacilities.find((facility) => {
    const space = facility.spaces.find((space => space.contractData.spaceId === query))
    if (space) {
      return true
    }
    return false
  }), [query, lodgingFacilities])
  // console.log('facility', facility)
  // console.log('space', space)

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

  const handler = async () => {
    try {
      setLoading(true)
      if (!contract) {
        throw new Error('Contract is not connected');
      }
      if (searchParams === undefined) {
        throw new Error('searchParams is undefined')
      }
      if (space === undefined) {
        throw new Error('space is undefined')
      }
      if (!account) {
        throw new Error('account is undefined')
      }
      if (!provider) {
        throw new Error('provider is undefined')
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
      )
      setTokenId(res)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError((error as Error).message);
    }
  }

  const isLoading = useMemo(() => !!bootstrapped && !!contract, [bootstrapped, contract])
  const borderColor = themeMode === ThemeMode.light ? 'brand' : 'accent-1'

  const searchQuery = useMemo(() => {
    return new URLSearchParams([
      ['startDay', String(searchParams?.startDay)],
      ['numberOfDays', String(searchParams?.numberOfDays)],
      ['guestsAmount', String(searchParams?.guestsAmount)],
    ])
  }, [searchParams])

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
            Booked succesfully!
            <NavLink to={`/tokens?tokenId=${tokenId}`}> Check details </NavLink>
          </Box>
        </Box>
      </MessageBox>


      {isLoading && !space && <Box> No space with given id </Box>}
      {isLoading && !!space && !tokenId && <Box
        flex={true}
        align='center'
        background='white'
        overflow='auto'
        pad='large'
      >
        <Image
          height='120'
          width='120'
          style={{ borderRadius: '50%' }}
          src={space.media.logo}
        />

        <Header> {space.name}</Header>
        {facility === undefined ? '' : <CustomText>{facility.address.streetAddress}, {facility.address.postalCode} {facility.address.locality}, {facility.address.country}. </CustomText>}
        {facility === undefined ? '' : <CustomText>{facility.contact?.email} {facility.contact?.website} {facility.contact?.phone}. </CustomText>}

        <Box style={{ width: '65rem', marginBottom: '2rem' }} pad={{ bottom: 'medium' }}>
          <Description>{space.description}</Description>
        </Box>

        <Box style={{ width: '65rem', marginBottom: '2rem' }} >
          <Box border='bottom' pad={{ bottom: 'small' }} direction='row'>
            <Title size='xxlarge'>Room type</Title>
          </Box>
          <Grid
            pad={{ vertical: 'medium' }}
            columns={['1/2', '1/2']}
          >
            <Box direction='row' align='center'>
              <Icons.Checkmark style={{ border: '1px solid #0D0E0F', borderRadius: '50%', padding: '0.3rem', marginRight: '0.5rem' }} color='#000' />
              <CustomText>{space.type} </CustomText>
            </Box>
          </Grid>
        </Box>

        <Box style={{ width: '65rem', marginBottom: '3rem' }} align='center' pad={{ bottom: 'medium' }}>
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

        <Box direction='row' style={{ width: '65rem' }} justify='between' align='center' >
          <Box direction='row' align='center'>
            <CustomText>Price per Night: </CustomText>
            <Title color={borderColor} size='large'>
              {utils.formatUnits(space.contractData.pricePerNightWei, 'ether')}
              DAI
            </Title>
          </Box>
          <Box align='center'>
            <BookWithDai
              onClick={handler}
              loading={loading}
              disabled={!!tokenId}
            />

            {hashLink !== null ?
              <ExternalLink href={hashLink} label={centerEllipsis(hash)} />
              : null}
          </Box>
        </Box>

        <Box width='xxlarge' pad={{ top: 'medium' }}>
          <MessageBox type='error' show={!!error}>
            <Box direction='row'>
              <Box>
                {error}
              </Box>
            </Box>
          </MessageBox>
        </Box>
      </Box>}
    </PageWrapper>
  );
};
