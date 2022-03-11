import { PageWrapper } from './PageWrapper';
import { SearchForm } from '../components/search/SearchForm';
import { Spinner } from 'grommet';
import { SearchResultCard } from '../components/SearchResultCard';
import { useAppState } from '../store';
import { useSpaceSearch } from '../hooks/useSpaceSearch';


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
  const { lodgingFacilities } = useAppState();

  const searchParams = new URLSearchParams(window.location.search)
  const departureDate = searchParams.get('departureDate')
  const returnDate = searchParams.get('returnDate')
  const guestsAmount = searchParams.get('guestsAmount')

  const { startDay, numberOfDays } = parseDateToDays(departureDate, returnDate)
  const [spaces, loading] = useSpaceSearch(startDay, numberOfDays)

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
      {spaces !== undefined ? spaces.map((space) =>
        <SearchResultCard key={space.spaceId} space={space} />
      ) : null}
    </PageWrapper>
  );
};
