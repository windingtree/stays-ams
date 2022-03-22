import { PageWrapper } from './PageWrapper';
import { Tag, Box, Text, Image, Carousel, Spinner } from 'grommet';
import { useAppState } from '../store';
import { useMemo, useEffect, useState } from 'react';
import { ThemeMode } from '../components/SwitchThemeMode';
import { BookWithDai } from '../components/buttons/BookWithDai';
import { SignInButton } from '../components/buttons/web3Modal';
import { MessageBox } from '../components/MessageBox';
import { ExternalLink } from '../components/ExternalLink';
import { getNetwork } from '../config';
import { centerEllipsis } from '../utils/strings';
import { useContract } from '../hooks/useContract';
import { NavLink } from 'react-router-dom';

export const Space: React.FC = () => {
  const { account, searchSpaces, themeMode, searchParams, provider, ipfsNode } = useAppState();
  const query = window.location.pathname.substring(7)
  const space = useMemo(() => searchSpaces.find((space) => space.id === query), [searchSpaces, query])

  const [contract, , errorContract] = useContract(provider, ipfsNode);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [hash, setHash] = useState('');
  const [tokenId, setTokenId] = useState<string | undefined>();

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
      setError((error as Error).message);
    }
  }

  const borderColor = themeMode === ThemeMode.light ? 'brand' : 'accent-1'
  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Search'
        }
      ]}
    >
      <MessageBox type='info' show={!!tokenId}>
        <Box direction='row'>
          <Box>
            Booked succesfully!
            <NavLink to={`/tokens/${tokenId}`}> Check details </NavLink>
          </Box>
        </Box>
      </MessageBox>
      <MessageBox type='error' show={!!error}>
        <Box direction='row'>
          <Box>
            {error}
          </Box>
        </Box>
      </MessageBox>
      {space === undefined ? <>Space not found</> : <Box
        border={{ color: borderColor }}
        flex={true}
        align='start'
        overflow='auto'
        pad='medium'
        round='small'
      >
        <Box pad={{ bottom: 'small' }}>
          <Text size='xxlarge'>
            {space.name}
          </Text>
          {/* <Text size='large'>
            {space.address === undefined ? '' : <Box>
              <Text>{space.address.country}</Text>
              <Text>{space.address.locality}</Text>
              <Text>{space.address.streetAddress}</Text>
            </Box>}
          </Text> */}
        </Box>
        <Box width='100%' align='center' gridArea="img" height="xlarge" pad={{ bottom: 'medium' }}>
          <Carousel height='xxlarge' width='xlarge'>
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
        <Box pad={{ bottom: 'small' }}>
          <Text size='xxlarge'>
            Info
          </Text>
        </Box>
        <Box pad={{ bottom: 'medium', left: 'small' }}>
          <Text>{space.description}</Text>
        </Box>
        <Box>
          <Box pad={{ bottom: 'small' }} direction='row'>
            <Text size='xxlarge'>Room type</Text>
          </Box>
          <Box pad={{ bottom: 'small' }} direction='row'>
            <Tag value={space.type} />
          </Box>
        </Box>
        <Box pad={{ right: 'medium' }} direction='row' justify='between' align='center' gridArea="action">

        </Box>
        <Box pad={{ right: 'medium' }} direction='row' width='100%' justify='between' align='center' gridArea="action">
          <Text>Price per Night: <Text color={borderColor} size='large'>{parseInt(`${space.pricePerNightWei}`)} DAI</Text></Text>
          <Box align='center'>
            {account ? <BookWithDai
              onClick={handler}
              loading={loading}
              disabled={!!error || !!tokenId}
            />
              : <SignInButton />
            }
            {hashLink !== null ?
              <ExternalLink href={hashLink} label={centerEllipsis(hash)} />
              : null
            }
          </Box>
        </Box>
      </Box>
      }
    </PageWrapper>
  );
};
