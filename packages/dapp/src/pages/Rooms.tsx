import React from "react";

import { Box, Text, Button, ResponsiveContext } from "grommet";
// import { useAppState } from '../store';
import { PageWrapper } from "./PageWrapper";
import { RoomCard } from "../components/rooms/RoomCard";

//export const Rooms = () => {
  export const Rooms = (): JSX.Element => {
    const size = React.useContext(ResponsiveContext);

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
        imageUrl:
          'https://m.hotels.ng/img/h1398654/562/422/b1/demeg-hotel-and-suites-1398654-7.jpg',
        name: 'Shakira Hotel Room',
        location: 'Jl. Aston No. 72 Yagyakarta',
        price: '350',
      },
      {
        imageUrl:
          'https://media.hotels.ng/img/h86784/562/422/b1/beni-gold-hotel-and-apartments-86784-6.jpg',
        name: 'Visala Hotel Room',
        location: 'Jl. Kebon, Thailand',
        price: '55.80',
      },

      {
        imageUrl:
          'https://media.hotels.ng/img/h998818/562/422/b1/choice-suites-(formerly-chantella-suites)-998818-11.jpg',
        name: 'Hogi Hotel Room',
        location: 'Malina, Indonesia',
        price: '45.20',
      },

      {
        imageUrl:
          'https://media.hotels.ng/img/h1007164/562/422/b1/extended-stay-grand-hotel-1007164-6.jpg',
        name: 'Oklahoma Hotel Room',
        location: 'Malina, United Kingdom',
        price: '125.20',
      },
    ];

    return (
      <PageWrapper
        breadcrumbs={[
          {
            path: "/",
            label: "Home",
          },
        ]}
      >
        <Text
          alignSelf="end"
          size="14px"
          color="brand"
          style={{ marginRight: 90, marginBottom: 15 }}
          weight="normal"
        >
          View all
        </Text>
        <Box direction={size == "large" ? "row" : "column"} alignSelf="center">
          {roomList.map((data, index) => (
            <RoomCard
              imageUrl={data.imageUrl}
              name={data.name}
              location={data.location}
              price={data.price}
            />
          ))}
        </Box>

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
      </PageWrapper>
    );
  };
