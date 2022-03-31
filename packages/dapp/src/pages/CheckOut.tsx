import { Avatar, Box, Button, Grid, Nav, Text, Spinner } from 'grommet';
import { useAppState } from '../store';
import { PageWrapper } from '../pages/PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { useCheckOut } from '../hooks/useCheckOut';
import { useAppReducer } from '../store/reducer';
import { useEffect, useState } from 'react';
import type { OwnerLodgingFacility, OwnerSpace } from '../store/actions';

import { TokenCard, TokenView } from './MyTokens';
import { StayToken } from 'stays-core';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import { useDayZero } from '../hooks/useDayZero';

const ResponsiveColumn = (winWidth: number): string[] => {
  if (winWidth >= 1300) {
    return ["21rem", "21rem", "21rem", "21rem"];
  } else if (winWidth >= 1000) {
    return ["21rem", "21rem", "21rem"];
  } else if (winWidth >= 768) {
    return ["23rem", "23rem"];
  } else if (winWidth >= 600) {
    return ["31rem"];
  } else if (winWidth <= 500) {
    return ["24rem"];
  } else if (winWidth <= 400) {
    return ["16rem"];
  }
  return [];
};

const FacilityList: React.FC<{
  facilities: OwnerLodgingFacility[],
  onSelect(facility: OwnerLodgingFacility): void
}> = ({ facilities, onSelect }) => {
  if (!facilities) {
    return null
  }
  return <Box
    border='right'
  >
    {facilities.map((facility: OwnerLodgingFacility, i) => (<Box key={i}>
      <Text onClick={() => onSelect(facility)} >
        [{facility.name}]
      </Text>
    </Box>))}
  </Box>
}

const SpacesList: React.FC<{
  facility: OwnerLodgingFacility | undefined,
  onSelect(tokens: StayToken[]): void
}> = ({ facility, onSelect }) => {
  if (!facility || !facility.spaces) {
    return null
  }
  return <Box>
    {facility.spaces.map((space: OwnerSpace, i) => (<Box key={i}>
      <Text onClick={() => onSelect(space.tokens)} >
        [{space.name}]
      </Text>
    </Box>))}
  </Box>
}

export const CheckOut = () => {

  const [, dispatch] = useAppReducer();
  const {
    account,
    isIpfsNodeConnecting,
    isOwnerBootstrapLoading,
    ownerBootstrapped,
    provider,
    ipfsNode,
  } = useAppState();

  const { winWidth } = useWindowsDimension();
  const [getDate, isGetDateReady, getDateError] = useDayZero(provider, ipfsNode);

  // console.log('kkkk',ownerLodgingFacilities)
  const [ownerLodgingFacilities, error] = useCheckOut(account, dispatch, provider, ipfsNode, ownerBootstrapped)

  const [selectedFacility, setSelectedFacility] = useState<OwnerLodgingFacility | undefined>()

  const [tokens, setTokens] = useState<StayToken[]>([])
  const [selectedToken, setSelectedToken] = useState<StayToken | undefined>()

  useEffect(() => {
    console.log('hello', ownerLodgingFacilities)
  }, [ownerLodgingFacilities])

  return (
    <PageWrapper
      breadcrumbs={[
        {
          path: '/',
          label: 'Home'
        }
      ]}
    >
      <MessageBox type='info' show={isIpfsNodeConnecting || isOwnerBootstrapLoading}>
        <Box direction='row'>
          <Box>
            The Dapp is synchronizing with the smart contract. Please wait..&nbsp;
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      <MessageBox type='info' show={!!error}>
        <Box direction='row'>
          <Box>
            {error}
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      <Grid
        fill='horizontal'
        pad='small'
        columns={['small', 'auto']}
        responsive
      >

        <FacilityList facilities={ownerLodgingFacilities} onSelect={setSelectedFacility} />

        <Box direction='column'>
          <SpacesList onSelect={setTokens} facility={selectedFacility} />
          <Box>
            {selectedToken &&
              <TokenView
                getDate={getDate}
                isGetDateReady={isGetDateReady}
                facilityOwner={account}
                {...selectedToken}
              />
            }
            <Grid
              alignSelf="center"
              columns={ResponsiveColumn(winWidth)}
              responsive={true}
            >
              {tokens?.map((token, index) => (
                <TokenCard
                  key={index}
                  onClick={() => setSelectedToken(token)}
                  {...token.data}
                />
              ))}
            </Grid>
          </Box>
        </Box>
      </Grid>

    </PageWrapper>
  );
};
