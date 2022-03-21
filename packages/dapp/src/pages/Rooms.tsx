import React from "react";

import { Link } from "react-router-dom";

import { Box, Text, Button, Grid /*, ResponsiveContext */ } from "grommet";
// import { useAppState } from '../store';
import { PageWrapper } from "./PageWrapper";
import { RoomCard } from "../components/rooms/RoomCard";
import { useWindowsDimension } from "../hooks/useWindowsDimension";

//export const Rooms = () => {
export const Rooms = (): JSX.Element => {
  // const size = React.useContext(ResponsiveContext);
  const { winWidth /*, winHeight */ } = useWindowsDimension();

  /*
    WIRE-FRAME URL
    https://docs.google.com/drawings/d/1RXaaLQR0d-g7ReIkKaB4Sz5_JQpxhcqOWccTxmGE6Ag/edit


    DESIGN URL
    https://dribbble.com/shots/16194078/attachments/8053310?mode=media


    ROOM IMAGES
    https://m.hotels.ng/img/h1398654/562/422/b1/demeg-hotel-and-suites-1398654-7.jpg
    https://m.hotels.ng/img/h1443996/562/422/b1/embassy-classic-hotels-owerri-1443996-18.jpg
    https://m.hotels.ng/img/h1438118/562/422/b1/swiss-international-beland-hotel-(formerly-beland-hotel-owerri)-1438118-26.jpg
    https://m.hotels.ng/img/h48897/562/422/b1/mercure-the-moorhouse-ikoyi-48897-7.jpg


    https://m.hotels.ng/img/h66239/562/422/b1/beni-hotels-66239-10.jpg
    https://media.hotels.ng/img/h998818/562/422/b1/choice-suites-(formerly-chantella-suites)-998818-7.jpg
    https://media.hotels.ng/img/h998818/562/422/b1/choice-suites-(formerly-chantella-suites)-998818-11.jpg
    https://media.hotels.ng/img/h1007164/562/422/b1/extended-stay-grand-hotel-1007164-4.jpg
    https://media.hotels.ng/img/h1007164/562/422/b1/extended-stay-grand-hotel-1007164-6.jpg
    https://media.hotels.ng/img/h86784/562/422/b1/beni-gold-hotel-and-apartments-86784-3.jpg
    https://media.hotels.ng/img/h86784/562/422/b1/beni-gold-hotel-and-apartments-86784-6.jpg
    */

  const roomList = [
    {
      RoomId: 10000,
      imageUrl:
        "https://m.hotels.ng/img/h1398654/562/422/b1/demeg-hotel-and-suites-1398654-7.jpg",
      name: "Shakira Hotel Room",
      location: "Jl. Aston No. 72 Yagyakarta",
      price: "350",
    },
    {
      RoomId: 10480,
      imageUrl:
        "https://media.hotels.ng/img/h86784/562/422/b1/beni-gold-hotel-and-apartments-86784-6.jpg",
      name: "Visala Hotel Room",
      location: "Jl. Kebon, Thailand",
      price: "55.80",
    },

    {
      RoomId: 19874,
      imageUrl:
        "https://media.hotels.ng/img/h998818/562/422/b1/choice-suites-(formerly-chantella-suites)-998818-11.jpg",
      name: "Hogi Hotel Room",
      location: "Malina, Indonesia",
      price: "45.20",
    },

    {
      RoomId: 12086,
      imageUrl:
        "https://media.hotels.ng/img/h1007164/562/422/b1/extended-stay-grand-hotel-1007164-6.jpg",
      name: "Oklahoma Hotel Room",
      location: "Malina, United Kingdom",
      price: "125.20",
    },
    {
      RoomId: 13413,
      imageUrl:
        "https://media.hotels.ng/img/h86784/562/422/b1/beni-gold-hotel-and-apartments-86784-6.jpg",
      name: "Phyroma Hotel Room",
      location: "Jl. Kebon, Thailand",
      price: "55.80",
    },

    {
      RoomId: 11182,
      imageUrl:
        "https://m.hotels.ng/img/h1438118/562/422/b1/swiss-international-beland-hotel-(formerly-beland-hotel-owerri)-1438118-26.jpg",
      name: "Valera Hotel Room",
      location: "Jl. Bryta, Poland",
      price: "105.20",
    },
  ];

  const ResponsiveColumn = () => {
    if (winWidth >= 1300) {
      return ["21rem", "21rem", "21rem", "21rem"];
    } else if (winWidth >= 1000) {
      return ["21rem", "21rem", "21rem"];
    } else if (winWidth >= 768) {
      return ["23rem", "23rem"];
    } else if (winWidth >= 600) {
      return ["31rem"];
    } else if (winWidth <= 500) {
      return ["24rem"];
    } else if (winWidth <= 400) {
      return ["16rem"];
    }
  };

  return (
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
        style={{ paddingBottom: 50, border: "0px solid red", width: "100%" }}
      >
        <Text
          alignSelf="end"
          size="14px"
          color="brand"
          style={{ marginRight: 0, marginBottom: 15 }}
          weight="normal"
        >
          View all
        </Text>

        <Grid
          alignSelf="center"
          //rows={[""]}
          columns={ResponsiveColumn()}
          //gap="xxsmall"
          responsive={true}
        >
          {roomList.map((data, index) => (
            <RoomCard
              key={index}
              imageUrl={data.imageUrl}
              name={data.name}
              location={data.location}
              price={data.price}
            />
          ))}
        </Grid>

        <Link
          to={{
            pathname: "/rooms/add",
            //code: rowData.code,
          }}
        >


          <Button
            primary
            color="status-ok"
            label="Add Room"
            style={{
              width: 150,
              height: 50,

              color: "white",
              fontSize: 15,
              marginTop: 80,
            }}
          />
        </Link>
      </Box>
    </PageWrapper>
  );
};
