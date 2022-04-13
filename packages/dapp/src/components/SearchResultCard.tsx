import { Box, Text, Image, Grid, Button, Notification } from 'grommet';
import type { Space } from 'stays-data-models'
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../store';
import styled from 'styled-components';
import { useCallback, useState } from 'react';
import { utils, BigNumber as BN } from 'ethers';

export const CustomButton = styled(Button)`
  color: black;
  border: 1px solid black;
  height: 2.5rem;
  width: 10rem;
  border-radius: 2.5rem;
  /* background: linear-gradient(90.72deg, #FFF500, #3B37FF, #0D0E0F); */

  font-weight: 700;
  font-size: 16px;
  line-height: 24px;

  &:hover,&:active {
    box-shadow: 0px 0px 0px 2px black;
  }
`;

export const SearchResultCard: React.FC<{
  space: Space,
  numberOfDays: number,
  roomsAmount: number
}> = ({ space, numberOfDays, roomsAmount }) => {
  const { account } = useAppState();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<string | undefined>();

  const getPrice = useCallback(
    (nights: number, rooms: number): string  => {
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
        rows={['xsmall', 'small', 'xsmall']}
        columns={['medium', 'flex']}
        gap="medium"
        areas={[
          { name: 'img', start: [0, 0], end: [1, 2] },
          { name: 'header', start: [1, 0], end: [1, 1] },
          { name: 'main', start: [1, 1], end: [1, 1] },
          { name: 'action', start: [1, 2], end: [1, 2] },
        ]}
        align='center'
      >
        <Box gridArea="img" fill>
          <Image
            fit="cover"
            src={space.media.logo}
          />
        </Box>
        <Box gridArea="header">
          <Text size='xxlarge'  >
            {space.name}
          </Text>
          {/* <Text size='large'>
            {space.address === undefined ? '' : <Box direction='row'>
              <Text>{space.address.country},</Text>
              <Text>{space.address.locality},</Text>
              <Text>{space.address.streetAddress}</Text>
            </Box>}
          </Text> */}
        </Box>
        <Box direction='column' justify='start' gridArea="main">
          {space.description}
        </Box>
        <Box pad={{ right: 'medium' }} direction='row' justify='between' align='center' gridArea="action">
          <Text size='large'>Price: {getPrice(numberOfDays, roomsAmount)} DAI</Text>
          <CustomButton
            size='large'
            label='Check Space'
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
