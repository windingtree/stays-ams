import { Box, Text, Image, Grid, Button } from 'grommet';
import type { Space } from 'stays-data-models'
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../store';
import { ThemeMode } from './SwitchThemeMode';
import { SignInButton } from './buttons/web3Modal';

export const SearchResultCard: React.FC<{ space: Space }> = ({ space }) => {
  const { themeMode, account } = useAppState();
  const navigate = useNavigate();

  return (
    <Box
      border={{ color: themeMode === ThemeMode.light ? 'brand' : 'accent-1', size: 'small' }}
      direction='row'
      round='small'
      align='center'
      overflow='hidden'
      background={{ color: `${themeMode}-1` }}
      margin={{ horizontal: 'small', vertical: 'medium' }}
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
          {account ? <Button
            size='large'
            label='Check Spaces'
            onClick={() => navigate(`/space/${space.contractData.spaceId}`)}
          /> : <SignInButton />}
        </Box>
      </Grid>
    </Box>
  );
};
