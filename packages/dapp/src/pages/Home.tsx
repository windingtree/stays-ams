import { Text } from 'grommet';
import { useAppState } from '../store';
import { PageWrapper } from '../pages/PageWrapper';
import { SearchForm } from '../components/search/SearchForm';
import { getNetworksNames } from '../config';

const allowedNetworksNames = getNetworksNames();

export const Home = () => {
  const { isRightNetwork } = useAppState();


  return (
    <PageWrapper>
      {!isRightNetwork &&
        <Text>
          You are connected to a wrong network. Please switch to one of: {allowedNetworksNames.join(', ')}
        </Text>
      }
      <SearchForm />
    </PageWrapper>
  );
};
