import type { RouteMatch } from 'react-router-dom';
import type { RouteConfig } from '../components/Routes';
import { useMemo } from 'react';
import { useLocation, matchRoutes } from 'react-router-dom';
import { pagesRoutesConfig } from '../components/Routes';

export const UNKNOWN_PAGE_TITLE = '404';

export const getPageTitle = (routes: RouteMatch[] | null): string =>
  routes
    ? (routes[0].route as RouteConfig).title || UNKNOWN_PAGE_TITLE
    : UNKNOWN_PAGE_TITLE;

export const usePageTitle = (): string => {
  const location = useLocation();

  return useMemo(
    () => getPageTitle(
      matchRoutes(pagesRoutesConfig, location)
    ),
    [location])
  ;
};
