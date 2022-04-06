import { Box, Text, Image, Grid, Button } from 'grommet';
import type { Space } from 'stays-data-models'
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../store';
// import { ThemeMode } from './SwitchThemeMode';
import { SignInButton } from './buttons/web3Modal';
import styled from 'styled-components';

export const CustomButton = styled(Button)`
  color:white;
  border: none;
  height: 2.5rem;
  width: 10rem;
  border-radius: 2.5rem;
  background: linear-gradient(90.72deg, #FFF500, #3B37FF, #0D0E0F);

  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
`;

export const SearchResultCard: React.FC<{ space: Space }> = ({ space }) => {
  const { themeMode, account } = useAppState();
  const navigate = useNavigate();

  return (
    <Box
      border={{
        color: '#000000',
        side: 'top',
      }}
      pad='large'
      direction='row'
      align='center'
      alignSelf='center'

      style={{ width: '64rem' }}
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
        <Box gridArea="img" height="100%" >
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
          lordem
        </Box>
        <Box pad={{ right: 'medium' }} direction='row' justify='between' align='center' gridArea="action">
          <Text size='large'>From: $$$</Text>
          {account ? <CustomButton
            size='large'
            label='Check Space'
            onClick={() => navigate(`/space/${space.contractData.spaceId}`)}
          /> : <SignInButton />}
        </Box>
      </Grid>
    </Box>
  );
};
