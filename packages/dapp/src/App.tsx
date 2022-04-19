import { Main } from 'grommet';
import { AppStateProvider } from './store';
import { GlobalStyle } from './GlobalStyle';
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { AppRoutes } from './components/Routes';

const App = () => {

  return (
    <AppStateProvider>
      <GlobalStyle>
        <Main>
          <AppHeader />
          <AppRoutes />
          <AppFooter />
        </Main>
      </GlobalStyle>
    </AppStateProvider>
  );
}

export default App;
