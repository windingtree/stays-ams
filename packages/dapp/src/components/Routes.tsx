import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useRoutes, useNavigate } from 'react-router-dom';
import { Menu } from 'grommet';
import { Menu as MenuIcon } from 'grommet-icons';
import { useAppState } from '../store';
import { Protected } from './Protected';
import styled from 'styled-components';
import { useWindowsDimension } from '../hooks/useWindowsDimension';

// Pages
import { Home } from '../pages/Home';
import { Message } from '../pages/Message';
import { Search } from '../pages/Search';
// import { Rooms } from "../pages/Rooms";
// import { RoomProfile } from "../pages/RoomProfile";
import { FacilityProfile } from "../pages/FacilityProfile";
import { SpaceProfile } from "../pages/SpaceProfile";
import { Space } from '../pages/Space';
import { MyTokens } from '../pages/MyTokens';
import { CheckIn } from '../pages/CheckIn';
import { Facilities } from '../pages/Facilities';
import { Token } from '../pages/Token';

const CustomMenu = styled(Menu)`
  border-radius: 50%;
  border: 1px solid black;
`;

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
    path: "/",
    element: <Home />,
    title: "Stays",
    label: "Home",
  },
  {
    path: '/message',
    element: <Message />,
    title: 'Useful information'
  },
  {
    path: "/search",
    element: <Search />,
    title: "Search for lodging facility",
  },
  {
    path: "/token",
    element: <Token />,
    title: "Token information",
    label: 'Tokens'
  },
  // {
  //   path: "/rooms",
  //   element: <Rooms />,
  //   title: "Rooms",
  //   label: "Rooms",
  //   protected: true,
  // },
  // {
  //   path: "/rooms/add",
  //   element: <RoomProfile />,
  //   title: "Add New Room",
  //   protected: true,
  // },
  {
    path: "/space/:id",
    element: <Space />,
    title: "Search for lodging facility",
    protected: true,
  },
  {
    path: '/tokens',
    element: <MyTokens />,
    title: 'My Stay Tokens',
    label: "My Tokens",
    protected: true,
  },
  {
    path: '/check-in',
    element: <CheckIn />,
    title: 'Check In',
    label: 'Check In',
    protected: true,
  },
  {
    path: '/facilities',
    element: <Facilities />,
    title: 'My Lodging Facilities',
    label: 'Lodging Facilities',
    protected: true,
  },
  {
    path: "/facilities/add",
    element: <FacilityProfile />,
    title: "Add New Lodging Facility",
    protected: true,
  },
  {
    path: "/facilities/edit/:id",
    element: <FacilityProfile />,
    title: "Edit Lodging Facility",
    protected: true,
  },
  {
    path: "/spaces/add/:facilityId",
    element: <SpaceProfile />,
    title: "Add New Space",
    protected: true,
  },
  {
    path: "/spaces/edit/:facilityId/:id",
    element: <SpaceProfile />,
    title: "Edit Space",
    protected: true,
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
  const { winWidth } = useWindowsDimension();
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
    <CustomMenu
      style={{ padding: winWidth > 512 ? '' : '0 3px' }}
      dropBackground={{ color: 'black', opacity: 0.9 }}
      dropAlign={{
        top: "bottom",
        left: "left",
      }}
      disabled={isConnecting}
      icon={(<MenuIcon color='black' />)}
      items={buildMenuConfig}
    />
  );
};
