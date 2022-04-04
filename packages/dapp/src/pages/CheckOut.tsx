import type { OwnerLodgingFacility, OwnerSpace } from '../store/actions';
import { useState } from 'react';
import { Box, Button, Grid, Spinner } from 'grommet';
import { PageWrapper } from '../pages/PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { useAppState } from '../store';
import { StayToken } from 'stays-core';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import { useDayZero } from '../hooks/useDayZero';
import { useOwnFacilities } from '../hooks/useOwnFacilities';
import { CheckOutView } from '../components/checkOut/CheckOutView';
import { CheckOutCard } from '../components/checkOut/CheckOutCard';
import { useCheckOut } from '../hooks/useCheckOut';

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

  const {
    account,
    isIpfsNodeConnecting,
    ownFacilities,
    provider,
    ipfsNode,
  } = useAppState();

  const { winWidth } = useWindowsDimension();
  const [getDate, isGetDateReady,] = useDayZero(provider, ipfsNode);
  const [
    ownFacilitiesLoading,
    ,
    ownFacilitiesError
  ] = useOwnFacilities(account, provider, ipfsNode);

  const [checkOut, isReady, checkOutLoading, checkOutError] = useCheckOut(
    account,
    provider,
    ipfsNode,
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
      <MessageBox type='info' show={isIpfsNodeConnecting || ownFacilitiesLoading}>
        <Box direction='row'>
          <Box>
            The Dapp is synchronizing with the smart contract. Please wait..&nbsp;
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      <MessageBox type='info' show={!!ownFacilitiesError}>
        <Box direction='row'>
          <Box>
            {ownFacilitiesError}
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

        <FacilityList facilities={ownFacilities ?? []} onSelect={setSelectedFacility} />

        <Box direction='column'>
          <SpacesList onSelect={setTokens} facility={selectedFacility} />
          <Box margin={{ top: 'small' }}>
            {selectedToken && isGetDateReady && isReady &&
              <CheckOutView
                getDate={getDate}
                facilityOwner={account}
                {...selectedToken}
                onClose={() => setSelectedToken(undefined)}
                checkOut={checkOut}
                error={checkOutError}
                loading={checkOutLoading}
              />
            }
            <Grid
              fill
              alignSelf="center"
              columns={ResponsiveColumn(winWidth)}
              responsive={true}
            >
              {tokens?.map((token, index) => (
                <CheckOutCard
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
