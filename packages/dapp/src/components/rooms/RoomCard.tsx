import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Header,
  Box,
  TextInput,
  Button,
  Image,
  Stack,
  Text,
  ResponsiveContext,
} from "grommet";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useAppState } from "../../store";
import { ThemeMode } from "../SwitchThemeMode";
import { Location } from "grommet-icons";

//export const RoomIndex = (): JSX.Element => {
export const RoomCard: React.FC<{
  imageUrl?: string;
  name?: string | null;
  location?: string | null;
  price?: string | null;
}> = ({ imageUrl, name, location, price }) => {
  const { themeMode } = useAppState();

  const size = React.useContext(ResponsiveContext);

  return (
    <>
      <Box margin="medium" >
        <Card
         
          //height={size == "large" ? "18rem" : "large"}
          //width={size == "large" ? "21rem" : "auto"}
         
          background="light-1"
          elevation="small"
        >
          <CardBody pad="small">
            <Image
              style={{ borderRadius: 10 }}
              fit="cover"
              //height="120rem"
              src={imageUrl}
            />
          </CardBody>

          <CardFooter pad={{ horizontal: "small" }} background="light-2">
            <Box
              direction="column"
              //border={{ color: "brand", size: "large" }}
              pad="medium"
            >
              <Box pad="small">
                <Text size="xlarge" weight="bold">
                  {name}
                </Text>
              </Box>
              <Box pad="xsmall" direction="row">
                <Location color="green" size="medium" />
                <Text
                  size="medium"
                  weight="normal"
                  color="dark-6"
                  style={{ marginTop: 5, marginLeft: 10 }}
                >
                  {location}
                </Text>
              </Box>

              <Box pad="xsmall" direction="row">
                <Text
                  size="xxlarge"
                  weight="bold"
                  style={{ marginTop: 5, marginLeft: 10 }}
                >
                  ${price}
                </Text>
                <Text
                  size="large"
                  weight="normal"
                  color="dark-6"
                  style={{ marginTop: 8, marginLeft: 10 }}
                >
                  / night
                </Text>
              </Box>
            </Box>
          </CardFooter>
        </Card>
      </Box>
    </>
  );
};
