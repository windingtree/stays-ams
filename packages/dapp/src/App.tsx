import { Main } from 'grommet';
import { AppStateProvider } from './store';
import { GlobalStyle } from './GlobalStyle';
import { AppHeader } from './components/AppHeader';
import { AppRoutes } from './components/Routes';

const App = () => {

  return (
    <AppStateProvider>
      <GlobalStyle>
        <Main>
          <AppHeader />
          <AppRoutes />
        </Main>
      </GlobalStyle>
    </AppStateProvider>
  );
}

export default App;
