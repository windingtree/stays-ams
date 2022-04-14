import { AppStateProvider } from "./store";
import { AppHeader } from "./components/AppHeader";
import { AppRoutes } from "./components/Routes";
import { MantineThemeOverride, MantineProvider } from "@mantine/core";

const links = [
  {
    link: "/about",
    label: "Home",
  },
  {
    link: "/pricing",
    label: "My Tokens",
  },
  {
    link: "/learn",
    label: "Check-in",
  },
  {
    link: "/community",
    label: "Facilities",
  },
];

const myTheme: MantineThemeOverride = {
  colorScheme: "light",
  primaryColor: "green",
  defaultRadius: 30,
};

const App = () => {
  return (
    <AppStateProvider>
      <MantineProvider theme={myTheme}>
        <AppHeader links={links} />
        <AppRoutes />
      </MantineProvider>
    </AppStateProvider>
  );
};

export default App;
