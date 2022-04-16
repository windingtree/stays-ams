import type { OwnerLodgingFacility, OwnerSpace } from '../store/actions';
import { useContext, useMemo, useState } from 'react';
import { Box, Button, ResponsiveContext, Spinner, Tab, Tabs, Text } from 'grommet';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageWrapper } from './PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { useAppState } from '../store';
import { CheckOutView } from '../components/checkOut/CheckOutView';
import { useCheckOut } from '../hooks/useCheckOut';
import { AddCircle, Edit } from 'grommet-icons';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { TxHashCallbackFn } from 'stays-core/dist/src/utils/sendHelper';

const CustomText = styled(Text)`
  color: #0D0E0F;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  text-align: start;
`;

// const ResponsiveColumn = (winWidth: number): string[] => {
//   if (winWidth >= 1300) {
//     return ["21rem", "21rem"];
//   } else if (winWidth >= 1000) {
//     return ["21rem", "21rem"];
//   } else if (winWidth >= 768) {
//     return ["21rem"];
//   } else if (winWidth >= 600) {
//     return ["31rem"];
//   } else if (winWidth <= 500) {
//     return ["24rem"];
//   } else if (winWidth <= 400) {
//     return ["16rem"];
//   }
//   return [];
// };

const FacilityList: React.FC<{
  selectedFacilityId: string | undefined,
  facilities: OwnerLodgingFacility[],
}> = ({ selectedFacilityId, facilities, children }) => {
  const navigate = useNavigate();
  const tabIndex = useMemo(() => {
    return facilities.findIndex(el => el.contractData.lodgingFacilityId === selectedFacilityId)
  }, [selectedFacilityId, facilities])

  if (!facilities) {
    return null
  }

  return <Tabs activeIndex={tabIndex} margin={{ top: 'large' }}>
    {facilities.map((facility, i) => (
      <Tab
        onClick={() => {
          const query = new URLSearchParams([
            ['facilityId', String(facility.contractData.lodgingFacilityId)],
          ]);
          navigate(`/facilities?${query}`, { replace: true });
        }}
        key={i}
        title={<CustomText>{facility.name}</CustomText>}
      >
        {children}
      </Tab>
    ))}
    <Tab onClick={() => navigate('/facilities/add')} icon={<AddCircle size='medium' radius='large' />} />
  </Tabs>
}

const SpacesList: React.FC<{
  facility: OwnerLodgingFacility | undefined,
  checkOut: (
    tokenId: string,
    checkOutDate: DateTime,
    transactionHashCb?: TxHashCallbackFn
  ) => void,
  loading: boolean,
  error: string | undefined,
}> = ({ facility, checkOut, loading, error }) => {
  const navigate = useNavigate();
  const [showTokens, setShowTokens] = useState<string>()
  if (!facility || !facility.spaces) {
    return null
  }

  return (
    <Box direction='column'>
      {facility.spaces.map((space: OwnerSpace, i) => (
        <Box
          key={i}
          border='bottom'
          pad='medium'
        >
          <Box
            key={i}
            direction='row'
            align='center'
            width='100%'
          >
            <Box
              // pad='medium'
              width='100%'
              onClick={() => setShowTokens(space.spaceId)}
            >
              <CustomText>{space.name}</CustomText>
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
          {showTokens === space.spaceId &&
            <Box>
              {space.tokens.length > 0 ? space.tokens.map((token, index) => (
                <CheckOutView
                  key={index}
                  facilityOwner={facility.contractData.owner}
                  checkOut={checkOut}
                  error={error}
                  loading={loading}
                  {...token}
                  onClose={() => setShowTokens('undefined')}
                />
              )) :
                <Box pad='medium'>
                  <Text>No tokens in this space</Text>
                </Box>
              }
            </Box>
          }
        </Box>
      ))}
    </Box>
  );
}

export const Facilities = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const size = useContext(ResponsiveContext);

  const {
    account,
    ownFacilities,
    ownFacilitiesLoading,
    provider,
    ipfsNode,
  } = useAppState();

  const [checkOut, isReady, checkOutLoading, checkOutError] = useCheckOut(
    account,
    provider,
    ipfsNode,
  );

  const facility = useMemo(() => {
    const params = new URLSearchParams(search)
    const facilityId = params.get('facilityId')
    console.log('useMemo', facilityId, ownFacilities)
    return ownFacilities?.find(f => f.contractData.lodgingFacilityId === facilityId)
  }, [search, ownFacilities]);

  return (
    <PageWrapper
      breadcrumbs={[
        {
          path: '/',
          label: 'Home'
        }
      ]}
    >
      <MessageBox type='info' show={!!ownFacilitiesLoading}>
        <Box direction='row'>
          <Box>
            The Dapp is synchronizing with the smart contract. Please wait..&nbsp;
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      <FacilityList
        selectedFacilityId={facility?.contractData.lodgingFacilityId}
        facilities={ownFacilities ?? []}
      >

        <Box
          pad={size}
          direction='column'
        >
          {facility &&
            <>
              <Box direction='row' align='center' margin={{ top: 'small', bottom: 'small' }}>
                <CustomText>{facility.name}</CustomText>
                <Button
                  icon={<Edit size='medium' radius='large' />}
                  onClick={() => navigate(
                    `/facilities/edit/${facility.contractData.lodgingFacilityId}`
                  )}
                />
              </Box>

              <Box direction='row' align='center' margin={{ top: 'small', bottom: 'small' }}>
                <CustomText>Spaces</CustomText>
                {facility &&
                  <Button
                    icon={<AddCircle size='medium' radius='large' />}
                    onClick={() => navigate(
                      `/spaces/add/${facility.contractData.lodgingFacilityId}`
                    )}
                  />
                }
              </Box>
            </>
          }

          {isReady &&
            <SpacesList
              checkOut={checkOut}
              error={checkOutError}
              loading={checkOutLoading}
              facility={facility}
            />
          }
        </Box>
      </FacilityList>
    </PageWrapper>
  );
};
