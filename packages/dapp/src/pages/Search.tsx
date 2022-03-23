import { PageWrapper } from './PageWrapper';
import { SearchForm } from '../components/search/SearchForm';
import { Spinner } from 'grommet';
import { SearchResultCard } from '../components/SearchResultCard';
import { useAppState } from '../store';
import { useSpaceSearch } from '../hooks/useSpaceSearch';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';


export const parseDateToDays = (firstDate: Date, secondDate: Date) => {
  const DAY_ZERO = new Date('05/11/2022')
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

  const startDay = Math.floor((new Date(firstDate).getTime() - new Date(DAY_ZERO).getTime()) / oneDay)
  const numberOfDays = Math.floor((new Date(secondDate).getTime() - new Date(firstDate ?? '').getTime()) / oneDay)
  return {
    startDay,
    numberOfDays
  }
};

export const parseDaysToDate = (startDay: number, numberOfDays: number) => {
  const DAY_ZERO = new Date('05/11/2022').getTime()
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

  const departureDate = new Date(DAY_ZERO + oneDay * (startDay))
  const returnDate = new Date(DAY_ZERO + oneDay * (startDay + numberOfDays))
  return {
    departureDate,
    returnDate
  }
};

export const Search = () => {
  const { searchSpaces } = useAppState();
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

  const { departureDate, returnDate } = useMemo(() => {
    const { departureDate, returnDate } = parseDaysToDate(startDay, numberOfDays)
    return {
      departureDate,
      returnDate
    }
  }, [startDay, numberOfDays])

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
