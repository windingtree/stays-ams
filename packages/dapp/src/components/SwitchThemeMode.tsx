import { useCallback } from 'react';
import { CheckBox } from 'grommet';
import { useAppState, useAppDispatch } from '../store';

export enum ThemeMode {
  light = 'light',
  dark = 'dark'
}

export const SwitchThemeMode: React.FC = () => {
  const dispatch = useAppDispatch();
  const { themeMode } = useAppState();

  const switchMode = useCallback(
    () => {
      dispatch(
        {
          type: 'SET_THEME_MODE',
          payload: themeMode === ThemeMode.dark
            ? ThemeMode.light
            : ThemeMode.dark
        }
      );
    },
    [dispatch, themeMode]
  );

  return (
    <CheckBox
      toggle
      checked={themeMode === ThemeMode.dark}
      pad='small'
      onChange={switchMode}
    />
  )
};
