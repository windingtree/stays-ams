import { Box, Text, Image, Grid, Button, Notification, Carousel, Anchor } from 'grommet';
import type { Space } from 'stays-data-models'
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../store';
import styled from 'styled-components';
import { useCallback, useMemo, useState } from 'react';
import { utils, BigNumber as BN } from 'ethers';
import { useWindowsDimension } from '../hooks/useWindowsDimension';

export const CustomButton = styled(Button)`
  color: black;
  border: 1px solid black;
  height: 2.5rem;
  minWidth: 10rem;
  border-radius: 2.5rem;
  /* background: linear-gradient(90.72deg, #FFF500, #3B37FF, #0D0E0F); */

  font-weight: 700;
  font-size: 16px;
  line-height: 24px;

  &:hover,&:active {
    box-shadow: 0px 0px 0px 2px black;
  }
`;

const ResponsiveColumn = (winWidth: number): string[] => {
  if (winWidth <= 768) {
    return ['medium'];
  }
  return ['medium', 'flex'];
};

const ResponsiveRow = (winWidth: number): string[] => {
  if (winWidth <= 768) {
    return ['medium', 'xsmall', 'small', 'xsmall'];
  }
  return ['xsmall', 'small', 'xsmall'];
};

const ResponsiveArea = (winWidth: number): any[] => {
  if (winWidth <= 768) {
    return [
      { name: 'img', start: [0, 0], end: [1, 0] },
      { name: 'header', start: [0, 1], end: [1, 1] },
      { name: 'main', start: [0, 2], end: [1, 2] },
      { name: 'action', start: [0, 3], end: [1, 3] },
    ];
  }
  return [
    { name: 'img', start: [0, 0], end: [1, 2] },
    { name: 'header', start: [1, 0], end: [1, 1] },
    { name: 'main', start: [1, 1], end: [1, 1] },
    { name: 'action', start: [1, 2], end: [1, 2] },
  ];
};
export const SearchResultCard: React.FC<{
  space: Space,
  numberOfDays: number,
  roomsNumber: number
}> = ({ space, numberOfDays, roomsNumber }) => {
  const { account, lodgingFacilities } = useAppState();
  const { winWidth } = useWindowsDimension();

  const navigate = useNavigate();
  const [notification, setNotification] = useState<string | undefined>();

  const facility = useMemo(
    () => lodgingFacilities.find((facility) => facility.id === space.contractData.lodgingFacilityId),
    [space, lodgingFacilities]
  )

  const getPrice = useCallback(
    (nights: number, rooms: number): string => {
      const perNight = BN.from(space?.contractData.pricePerNightWei ?? 0);
      return utils.formatUnits(
        perNight.mul(BN.from(nights)).mul(BN.from(rooms)),
        'ether'
      );
    },
    [space]
  );

  return (
    <Box
      fill
      border={{
        color: '#000000',
        side: 'bottom',
      }}
      direction='row'
      align='center'
      alignSelf='center'
      overflow='hidden'
    >
      <Grid
        responsive
        width='100%'
        rows={ResponsiveRow(winWidth)}
        columns={ResponsiveColumn(winWidth)}
        areas={ResponsiveArea(winWidth)}
        pad='medium'
        gap="medium"
        align='center'
      >
        <Box gridArea="img" fill>
          <Carousel fill>
            <Image
              fit="cover"
              src={space.media.logo}
            />
            {space.media.images?.map((img, i) =>
              <Image
                key={i}
                fit="cover"
                src={img.uri}
              />
            )}
          </Carousel>
        </Box>
        <Box gridArea="header">
          <Text size='xxlarge' margin={{ bottom: 'medium' }}>
            {space.name} {'🛌🏾 '.repeat(space.beds)}
          </Text>
          <Text size='xlarge'>
            {facility?.name}
            &nbsp;
            <Anchor
              label="🌎"
              href={facility?.contact?.website ?? ''}
              title={facility?.name ?? ''}
              target="_blank"
            />
          </Text>
        </Box>
        <Box direction='column' justify='start' gridArea="main">
          <Text size='large'>
            {space.description}
          </Text>
        </Box>
        <Box direction='column' justify='between' align='center' gridArea="action">
          <Text size='large'>{numberOfDays} nights, {roomsNumber} room{roomsNumber > 1 ? 's' : ''}</Text>
          <CustomButton
            label={'Book for ' + getPrice(numberOfDays, roomsNumber) + ' xDAI'}
            onClick={() => {
              if (account) {
                navigate(`/space/${space.contractData.spaceId}`);
              } else {
                setNotification('Please connect wallet');
                setTimeout(() => setNotification(undefined), 2000);
              }
            }}
          />
        </Box>
      </Grid>
      {notification &&
        <Notification
          toast
          title={notification}
          status='warning'
        />
      }
    </Box>
  );
};
