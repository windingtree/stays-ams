import { PageWrapper } from './PageWrapper';
import { SearchForm } from '../components/search/SearchForm';
import { Box, Spinner } from 'grommet';
import { SearchResultCard } from '../components/SearchResultCard';
import { useAppState } from '../store';
import { useSpaceSearch } from '../hooks/useSpaceSearch';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageBox } from '../components/MessageBox';
import { useDayZero } from '../hooks/useDayZero';
import { GradientText, WhiteText } from './Home';

export const Search = () => {
  const { searchSpaces, provider, ipfsNode } = useAppState();
  const { search } = useLocation();

  const { startDay, numberOfDays, guestsAmount } = useMemo(() => {
    const params = new URLSearchParams(search)
    const startDay = Number(params.get('startDay'))
    const numberOfDays = Number(params.get('numberOfDays'))
    return {
      startDay,
      numberOfDays,
      guestsAmount: Number(params.get('guestsAmount')),
    }
  }, [search])

  const [loading, error] = useSpaceSearch(startDay, numberOfDays, guestsAmount)
  const [getDate, isGetDateReady] = useDayZero(provider, ipfsNode);

  const filteredSpaces = useMemo(() => {
    return searchSpaces.filter((space: any) => space.capacity >= guestsAmount)
  }, [searchSpaces, guestsAmount])

  return (
    <PageWrapper
      breadcrumbs={[
        {
          path: '/',
          label: 'Home'
        }
      ]}
    >
      <WhiteText>April 18-25 2022</WhiteText>
      <WhiteText>Devconnect APRIL 18-25, 2022 Amsterdam, The Netherlands</WhiteText>
      <GradientText>Amsterdam</GradientText>
      <WhiteText>A collaborative Ethereum week, built by and for everyone</WhiteText>

      {isGetDateReady && <SearchForm
        getDate={getDate}
        startDay={startDay}
        numberOfDays={numberOfDays}
        initGuestsAmount={guestsAmount}
      />}

      <MessageBox type='error' show={!!error}>
        <Box direction='row'>
          <Box>
            {error}
          </Box>
        </Box>
      </MessageBox>

      {loading ? <Spinner color='accent-1' alignSelf='center' size='medium' /> : null}
      {filteredSpaces !== undefined && isGetDateReady ? filteredSpaces.map((space) =>
        <SearchResultCard key={space.contractData.spaceId} space={space} />
      ) : null}
    </PageWrapper>
  );
};
