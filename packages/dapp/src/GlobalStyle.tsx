import { Grommet } from 'grommet';
import { grommet } from 'grommet/themes';
import { generate } from 'grommet/themes/base';
import { deepMerge } from 'grommet/utils';
import { useAppState } from './store';

const baseTheme = deepMerge(grommet, {
  ...generate(16),
  tab: {
    color: '#000',
    border: {
      color: '#fff'
    },
    hover: {
      color: '#000',
    },
    active: {
      color: '#000'
    }
  }
});

export const GlobalStyle: React.FC = ({ children }) => {
  const { themeMode } = useAppState();

  return (
    <Grommet

      theme={baseTheme}
      themeMode={themeMode}
      style={{
        height: 'auto',
        minHeight: '100vh',
        backgroundAttachment: 'fixed'
      }}
      background={{
        image: 'url(/bg.jpg)',
        position: 'center',
        size: 'cover'
      }}
    >
      {children}
    </Grommet>
  );
};
