import { PageWrapper } from './PageWrapper';
import { Tag, Box, Text, Button, Image, Carousel } from 'grommet';
import { useAppState } from '../store';
import { useMemo } from 'react';
import { ThemeMode } from '../components/SwitchThemeMode';

export const Space: React.FC = () => {
  const { searchSpaces, themeMode } = useAppState();
  const searchParams = window.location.pathname.substring(7)

  const space = useMemo(() => searchSpaces.find((space) => space.id === searchParams), [searchSpaces, searchParams])

  const borderColor = themeMode === ThemeMode.light ? 'brand' : 'accent-1'
  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Search'
        }
      ]}
    >
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
          <Text size='large'>
            {space.address === undefined ? '' : <Box>
              <Text>{space.address.country}</Text>
              <Text>{space.address.locality}</Text>
              <Text>{space.address.streetAddress}</Text>
            </Box>}
          </Text>
        </Box>
        <Box width='100%' align='center' gridArea="img" height="xlarge" pad={{ bottom: 'medium' }}>
          <Carousel height='xxlarge' width='xlarge'>
            {space.media.images?.map((space) =>
              <Image
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
          <Text>{space.longDescription}</Text>
        </Box>
        <Box>
          <Box pad={{ bottom: 'small' }} direction='row'>
            <Text size='xxlarge'>Room type</Text>
          </Box>
          <Box pad={{ bottom: 'small' }} direction='row'>
            {space.type?.map((t) => <Tag value={t} />)}
          </Box>
        </Box>
        <Box pad={{ right: 'medium' }} direction='row' justify='between' align='center' gridArea="action">

        </Box>
        <Box pad={{ right: 'medium' }} direction='row' width='100%' justify='between' align='center' gridArea="action">
          <Text>Price per Night: <Text color={borderColor} size='large'>{parseInt(`${space.pricePerNightWei}`)} DAI</Text></Text>
          <Button
            size='large'
            label='Buy with DAI'
            onClick={() => console.log(`/space/${space.id}`)}
          />
        </Box>
      </Box>
      }
    </PageWrapper>
  );
};
