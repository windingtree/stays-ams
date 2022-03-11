// import { Box } from 'grommet';
// import { useAppState } from '../store';
import { PageWrapper } from './PageWrapper';

export const Manager = () => {
  // const {} = useAppState();

  return (
    <PageWrapper
      breadcrumbs={[
        {
          path: '/',
          label: 'Home'
        }
      ]}
    >

    </PageWrapper>
  );
};
