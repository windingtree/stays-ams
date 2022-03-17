

import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Box,
  Image,
  Text,
  ResponsiveContext,
} from 'grommet';
import { Location } from 'grommet-icons';
import { PageWrapper } from "./PageWrapper";
import { RoomProfileCard } from "../components/rooms/RoomProfileCard";


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
            <RoomProfileCard />
          </Box>
        </PageWrapper>
      </>
    );
};