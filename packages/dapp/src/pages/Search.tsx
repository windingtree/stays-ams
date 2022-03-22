import { PageWrapper } from './PageWrapper';
import { SearchForm } from '../components/search/SearchForm';
import { Spinner } from 'grommet';
import { SearchResultCard } from '../components/SearchResultCard';
import { useAppState } from '../store';
import { useSpaceSearch } from '../hooks/useSpaceSearch';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';


const parseDateToDays = (firstDate: string | null, secondDate: string | null) => {
  const DEFAULT_START_DAY = new Date(2022, 4, 22)
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

  const startDay = Math.round(Math.abs((new Date(firstDate ?? '').getTime() - new Date(DEFAULT_START_DAY).getTime()) / oneDay))
  const numberOfDays = Math.round(Math.abs((new Date(secondDate ?? '').getTime() - new Date(firstDate ?? '').getTime()) / oneDay))
  return {
    startDay,
    numberOfDays
  }
};

export const Search = () => {
  const { searchSpaces } = useAppState();
  const { search } = useLocation();

  const { departureDate, returnDate, guestsAmount } = useMemo(() => {
    const params = new URLSearchParams(search)
    return {
      departureDate: params.get('departureDate'),
      returnDate: params.get('returnDate'),
      guestsAmount: Number(params.get('guestsAmount')),
    }
  }, [search])

  const { startDay, numberOfDays } = useMemo(() => {
    const { startDay, numberOfDays } = parseDateToDays(departureDate, returnDate)
    return {
      startDay,
      numberOfDays
    }
  }, [departureDate, returnDate])

  const [loading] = useSpaceSearch(startDay, numberOfDays, guestsAmount)

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
      <SearchForm
        initReturnDate={returnDate}
        initDepartureDate={departureDate}
        initGuestsAmount={guestsAmount}
      />
      {loading ? <Spinner color='accent-1' alignSelf='center' size='medium' /> : null}
      {filteredSpaces !== undefined ? filteredSpaces.map((space) =>
        <SearchResultCard key={space.contractData.spaceId} space={space} />
      ) : null}
    </PageWrapper>
  );
};
