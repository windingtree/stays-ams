import { Grommet, Image } from 'grommet';
import { grommet } from 'grommet/themes';
import { generate } from 'grommet/themes/base';
import { deepMerge } from 'grommet/utils';
import { useAppState } from './store';

const baseTheme = deepMerge(grommet, generate(16));

export const GlobalStyle: React.FC = ({ children }) => {
  const { themeMode } = useAppState();

  return (
    <Grommet
      full
      style={{ height: 'auto', minHeight: '100vh' }}
      theme={baseTheme}
      themeMode={themeMode}
      background={{position: 'relative'}}
    >
      <Image
        fit="cover"
        src='https://localhost:3000/background.png'
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          zIndex: '-100'
        }}
      />
      {children}
    </Grommet>
  );
};
