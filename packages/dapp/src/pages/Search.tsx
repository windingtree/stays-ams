import { PageWrapper } from './PageWrapper';
import { SearchForm } from '../components/search/SearchForm';

export const Search = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const departureDate = searchParams.get('departureDate')
  const returnDate = searchParams.get('returnDate')
  const guestsAmount = searchParams.get('guestsAmount')
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
    </PageWrapper>
  );
};
