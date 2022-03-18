import React from 'react';
import { Box } from 'grommet';
import {PageWrapper} from "./PageWrapper";
import {RoomProfileCard} from "../components/rooms/RoomProfileCard";

export const RoomProfile = (): JSX.Element => {

  return (
    <>
      <PageWrapper
        breadcrumbs={[
          {
            path: "/",
            label: "Home",
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
          <RoomProfileCard/>
        </Box>
      </PageWrapper>
    </>
  );
};
