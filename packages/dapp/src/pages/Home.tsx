import React from "react";
import { createStyles, Container, Title, Text, Button } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: "#11284b",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage:
      "linear-gradient(250deg, rgba(130, 201, 30, 0) 0%, #062343 70%), url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80)",
    paddingTop: theme.spacing.xl * 3,
    paddingBottom: theme.spacing.xl * 3,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",

    [theme.fn.smallerThan("md")]: {
      flexDirection: "column",
    },
  },

  image: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  content: {
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan("md")]: {
      marginRight: 0,
    },
  },

  title: {
    color: theme.white,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    lineHeight: 1.05,
    maxWidth: 500,
    fontSize: 48,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      fontSize: 34,
      lineHeight: 1.15,
    },
  },

  description: {
    color: theme.white,
    opacity: 0.75,
    maxWidth: 500,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
    },
  },

  control: {
    paddingLeft: 50,
    paddingRight: 50,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 22,

    [theme.fn.smallerThan("md")]: {
      width: "100%",
    },
  },
}));

export const GradientText = "";

export function Home() {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Devconnect{" "}
              <Text
                component="span"
                inherit
                variant="gradient"
                gradient={{ from: "green", to: "yellow" }}
              >
                Amsterdam
              </Text>{" "}
              2022
            </Title>

            <Text className={classes.description} mt={30}>
              April 17-25
            </Text>
            <Text className={classes.description} mt={30}>
              Devconnect Amsterdam brings together hundreds of people from all
              over the world. Within one week there will be held various
              independent Ethereum events as well as in-person gatherings with
              the focus on communication, learning and making progress on
              specific subjects. With Win.so you can on-chain your stay in
              Amsterdam during Devconnect. Book with us. Pay in xDAI. Check-in
              with NFT. Get Rewards for the next ETH event.
            </Text>

            <Button
              variant="gradient"
              gradient={{ from: "green", to: "yellow" }}
              size="xl"
              className={classes.control}
              mt={40}
            >
              Find accomodation
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
