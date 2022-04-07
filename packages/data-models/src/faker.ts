import type {
  AddressReference,
  MediaReference
} from '@windingtree/org.json-schema/types/org.json';
import {
  LodgingFacilityRaw,
  SpaceRaw
} from './types';
import { faker } from '@faker-js/faker';
import {
  allowedLodgingFacilityTypes,
  allowedLodgingFacilityTiers,
  allowedSpaceTypes
} from './enum';

export const randomItem = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)];

export const iterator = <T>(count: number, callback: () => T): T[] =>
  Array(count).fill(null).map(() => callback());

export const createFakeAddress = (): AddressReference => ({
  country: faker.address.countryCode(),
  subdivision: faker.datatype.number({ max: 100 }).toString(),
  locality: faker.address.cityName(),
  postalCode: faker.address.zipCode(),
  streetAddress: faker.address.streetAddress(),
  premise: faker.address.secondaryAddress(),
  gps: `${faker.address.latitude()},${faker.address.longitude()}`
});

export const createFakeImage = (): MediaReference => ({
  description: faker.lorem.sentence(),
  uri: faker.image.city()
});

export const createFakeLodgingFacility = (): LodgingFacilityRaw => ({
  name: faker.company.companyName(),
  description: faker.lorem.lines(3),
  type: randomItem(allowedLodgingFacilityTypes),
  tier: randomItem(allowedLodgingFacilityTiers),
  amenities: iterator(6, faker.company.bsNoun),
  contact: {
    name: faker.commerce.department(),
    phone: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    website: `https://${faker.internet.domainName()}`,
    messengers: [
      {
        type: 'whatsapp',
        value: faker.phone.phoneNumber()
      }
    ]
  },
  address: createFakeAddress(),
  operator: {
    name: faker.company.companyName(),
    address: createFakeAddress()
  },
  media: {
    logo: faker.image.abstract(),
    images: iterator(5, createFakeImage)
  }
});

export const createFakeSpace = (): SpaceRaw => ({
  name: faker.company.companyName(),
  description: faker.lorem.lines(3),
  type: randomItem(allowedSpaceTypes),
  amenities: iterator(6, faker.company.bsNoun),
  capacity: faker.datatype.number({ min: 1, max: 5 }),
  guestsNumber: faker.datatype.number({ min: 1, max: 5 }),
  beds: faker.datatype.number({ min: 1, max: 3 }),
  price: faker.datatype.number({ min: 35, max: 250 }).toString(),
  media: {
    logo: faker.image.abstract(),
    images: iterator(5, createFakeImage)
  }
});
