import { Box } from 'grommet';
import { PageWrapper } from "./PageWrapper";
import { FacilityProfileCard } from "../components/rooms/FacilityProfileCard";

export const FacilityProfile = (): JSX.Element => {

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
        <FacilityProfileCard />
      </Box>
    </PageWrapper>
  );
};
