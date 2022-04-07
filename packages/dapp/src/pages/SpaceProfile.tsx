import { Box } from 'grommet';
import { PageWrapper } from "./PageWrapper";
import { SpaceProfileCard } from "../components/rooms/SpaceProfileCard";

export const SpaceProfile = (): JSX.Element => {

  return (
    <PageWrapper
      breadcrumbs={[
        {
          path: "/",
          label: "Home",
        },
        {
          path: "/facilities",
          label: "Facilities",
        },
      ]}
    >
      <Box
        alignSelf="center"
        style={{
          paddingBottom: 50,
          border: "0px solid red",
          width: "100%",
        }}
      >
        <SpaceProfileCard />
      </Box>
    </PageWrapper>
  );
};
