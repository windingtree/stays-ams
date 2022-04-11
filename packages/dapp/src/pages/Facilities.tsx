import type { OwnerLodgingFacility, OwnerSpace } from '../store/actions';
import { useState } from 'react';
import { Box, Button, Grid, Spinner, Text } from 'grommet';
import { NavLink, useNavigate } from 'react-router-dom';
import { PageWrapper } from './PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { useAppState } from '../store';
import { StayToken } from 'stays-core';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import { useDayZero } from '../hooks/useDayZero';
import { CheckOutView } from '../components/checkOut/CheckOutView';
import { CheckOutCard } from '../components/checkOut/CheckOutCard';
import { useCheckOut } from '../hooks/useCheckOut';
import { AddCircle, Edit } from 'grommet-icons';

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
  selectedFacilityId: string | undefined,
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
        margin={{ bottom: 'small' }}
      />
    </Box>))}

    <NavLink to='/facilities/add'>
      Add new facility
    </NavLink>
  </Box>
}

const SpacesList: React.FC<{
  facility: OwnerLodgingFacility | undefined,
  onSelect(tokens: StayToken[]): void
}> = ({ facility, onSelect }) => {
  const navigate = useNavigate();
  if (!facility || !facility.spaces) {
    return null
  }
  return (
    <Box direction='column'>
      {facility.spaces.map((space: OwnerSpace, i) => (
        <Box
          key={i}
          direction='row'
          align='center'
          border='bottom'
          width='100%'
        >
          <Box
            pad='medium'
            width='100%'
            onClick={() => onSelect(space.tokens)}
          >
            <Text>{space.name}</Text>
            {/* <Button
              // onClick={() => onSelect(space.tokens)}
              label={space.name}
            /> */}
          </Box>
          <Box>
            <Button
              icon={<Edit size='medium' radius='large' />}
              onClick={() => navigate(
                `/spaces/edit/${facility.contractData.lodgingFacilityId}/${space.spaceId}`
              )}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export const Facilities = () => {
  const navigate = useNavigate();

  const {
    account,
    isIpfsNodeConnecting,
    ownFacilities,
    ownFacilitiesLoading,
    provider,
    ipfsNode,
  } = useAppState();

  const { winWidth } = useWindowsDimension();
  const [getDate, isGetDateReady,] = useDayZero(provider, ipfsNode);

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
      <MessageBox type='info' show={isIpfsNodeConnecting || !!ownFacilitiesLoading}>
        <Box direction='row'>
          <Box>
            The Dapp is synchronizing with the smart contract. Please wait..&nbsp;
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      <Grid
        fill='horizontal'
        pad='small'
        columns={['medium', 'auto']}
        responsive
        margin={{ top: 'large' }}
        gap='medium'
      >

        <FacilityList
          selectedFacilityId={selectedFacility?.contractData.lodgingFacilityId}
          facilities={ownFacilities ?? []} onSelect={setSelectedFacility}
        />

        <Box
          pad='small'
          direction='column'
        >

          {selectedFacility &&
            <>
              <Box direction='row' align='center' margin={{ top: 'small', bottom: 'small' }}>
                <Text>{selectedFacility.name}</Text>
                <Button
                  icon={<Edit size='medium' radius='large' />}
                  onClick={() => navigate(
                    `/facilities/edit/${selectedFacility.contractData.lodgingFacilityId}`
                  )}
                />
              </Box>

              <Box direction='row' align='center' margin={{ top: 'small', bottom: 'small' }}>
                <Text>Spaces</Text>
                {selectedFacility &&
                  <Button
                    icon={<AddCircle size='medium' radius='large' />}
                    onClick={() => navigate(
                      `/facilities/edit/${selectedFacility.contractData.lodgingFacilityId}`
                    )}
                  />
                }
              </Box>  
            </>
          }

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
