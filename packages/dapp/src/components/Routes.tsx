import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useRoutes, useNavigate } from 'react-router-dom';
import { Menu } from 'grommet';
import { Menu as MenuIcon } from 'grommet-icons';
import { useAppState } from '../store';
import { Protected } from './Protected';

// Pages
import { Home } from '../pages/Home';
import { Search } from '../pages/Search';
import { Manager } from '../pages/Manager';

export interface RouteConfig {
  path: string;
  element: ReactNode;
  title: string;
  label?: string;
  protected?: boolean;
}

export type Routes = RouteConfig[];

export const pagesRoutesConfig: Routes = [
  {
    path: '/',
    element: <Home />,
    title: 'EthRio Stays',
    label: 'Home'
  },
  {
    path: '/search',
    element: <Search />,
    title: 'Search for lodging facility',
    label: 'Search'
  },
  {
    path: '/manager',
    element: <Manager />,
    title: 'Lodging facility manager',
    label: 'Manager',
    protected: true
  },
];

export const processPagesConfig = (config: Routes): Routes =>
  config.map(
    (route: RouteConfig) => route.protected
      ? {
        ...route,
        element: <Protected component={route.element} />
      }
      : route
  );

export const AppRoutes = () => useRoutes(
  useMemo(
    () => processPagesConfig(pagesRoutesConfig), []
  )
);

export const GlobalMenu = () => {
  const { isConnecting } = useAppState();
  const navigate = useNavigate();
  const buildMenuConfig = useMemo(
    () => pagesRoutesConfig
      .reduce<Routes>(
        (a, v) => ([
          ...a,
          ...(
            v.label // Items without labels are ignored
              ? [
                {
                  ...v,
                  onClick: () => navigate(v.path)
                }
              ]
              : []
          )
        ]),
        []
      ),
    [navigate]
  );

  return (
    <Menu
      disabled={isConnecting}
      icon={(<MenuIcon />)}
      items={buildMenuConfig}
    />
  );
};
