import type { OwnerLodgingFacility, OwnerSpace } from '../store/actions';
import { Box, Button, Grid, Spinner } from 'grommet';
import { useAppState } from '../store';
import { PageWrapper } from '../pages/PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { useCheckOut } from '../hooks/useCheckOut';
import { useAppReducer } from '../store/reducer';
import { useState } from 'react';

import { StayToken } from 'stays-core';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import { useDayZero } from '../hooks/useDayZero';
import { CheckOutView } from '../components/checkOut/CheckOutView';
import { CheckOutCard } from '../components/checkOut/CheckOutCard';

const ResponsiveColumn = (winWidth: number): string[] => {
  if (winWidth >= 1300) {
    return ["21rem", "21rem"];
  } else if (winWidth >= 1000) {
    return ["21rem", "21rem"];
  } else if (winWidth >= 768) {
    return ["21rem"];
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
  return <Box>
    {facilities.map((facility, i) => (<Box key={i}>
      <Button
        onClick={() => onSelect(facility)}
        label={facility.name}
      />
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
  return <Box direction='row'>
    {facility.spaces.map((space: OwnerSpace, i) => (<Box key={i}>
      <Button
        onClick={() => onSelect(space.tokens)}
        label={space.name}
      />
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

  const [ownerLodgingFacilities, checkOut, error] = useCheckOut(
    account,
    dispatch,
    provider,
    ipfsNode,
    ownerBootstrapped
  )
  const [selectedFacility, setSelectedFacility] = useState<OwnerLodgingFacility | undefined>()

  const [tokens, setTokens] = useState<StayToken[]>([])
  const [selectedToken, setSelectedToken] = useState<StayToken | undefined>()

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

      <MessageBox type='error' show={!!error}>
        <Box direction='row'>
          <Box>
            {error}
          </Box>
        </Box>
      </MessageBox>

      <MessageBox type='error' show={!!getDateError}>
        <Box direction='row'>
          <Box>
            {getDateError}
          </Box>
        </Box>
      </MessageBox>

      <Grid
        fill='horizontal'
        pad='small'
        columns={['medium', 'auto']}
        responsive
        gap='medium'
      >

        <FacilityList facilities={ownerLodgingFacilities} onSelect={setSelectedFacility} />

        <Box direction='column'>
          <SpacesList onSelect={setTokens} facility={selectedFacility} />
          <Box margin={{ top: 'small' }}>
            {selectedToken && isGetDateReady &&
              <CheckOutView
                getDate={getDate}
                isGetDateReady={isGetDateReady}
                facilityOwner={account}
                {...selectedToken}
                onClose={() => setSelectedToken(undefined)}
                checkOut={checkOut}
              />
            }
            <Grid
              fill
              alignSelf="center"
              columns={ResponsiveColumn(winWidth)}
              responsive={true}
            >
              {tokens.length !== 0 ? tokens.map((token, index) => (
                <CheckOutCard
                  key={index}
                  onClick={() => setSelectedToken(token)}
                  {...token.data}
                />
              )) : null}
            </Grid>
            <MessageBox type='info' show={!tokens.length}>
              <Box direction='row'>
                <Box>
                  No tokens
                </Box>
              </Box>
            </MessageBox>
          </Box>
        </Box>
      </Grid>

    </PageWrapper>
  );
};
