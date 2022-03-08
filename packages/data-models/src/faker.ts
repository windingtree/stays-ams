import type {
  LegalEntityReference,
  OrganizationalUnitReference,
  IdentifierReference,
  AddressReference,
  GeoCodeReference,
  OpeningHoursRangeReference,
  ContactReference,
  MessengerReference,
  MediaReference
} from '@windingtree/org.json-schema/types/org.json';
import { faker } from '@faker-js/faker';

export const iterator = <T>(count: number, callback: () => T): T[] =>
  Array(count).fill(null).map(() => callback());

export const createFakeCompanyIdentifier = (): IdentifierReference => ({
  type: faker.random.alphaNumeric(4).toUpperCase(),
  value: faker.random.alphaNumeric(10)
});

export const createFakeAddress = (): AddressReference => ({
  country: faker.address.countryCode(),
  subdivision: faker.datatype.number({ max: 100 }).toString(),
  locality: faker.address.cityName(),
  postalCode: faker.address.zipCode(),
  streetAddress: faker.address.streetAddress(),
  premise: faker.address.secondaryAddress()
});

export const createFakeGeocode = (): GeoCodeReference => ({
  'type': faker.random.alpha(3),
  'value': `${faker.random.alphaNumeric(8)} ${faker.address.cityName()}`
});

export const createFakeOpeningHours = (): OpeningHoursRangeReference => ({
  weekDay: iterator(3, () => faker.date.weekday({ context: true }).toLowerCase()).join(','),
  hours: faker.datatype.boolean() ? '9:00-18:00' : '9:00-15:00'
});

export const createFakeMessenger = (): MessengerReference => ({
  type: 'whatsapp', // @todo generate more messengers types
  value: faker.phone.phoneNumber()
});

export const createFakeContact = (): ContactReference => ({
  function: faker.name.jobTitle(),
  name: faker.name.findName(),
  phone: faker.phone.phoneNumber(),
  email: faker.internet.email(),
  messengers: iterator(3, createFakeMessenger)
});

export const createFakeImage = (): MediaReference => ({
  description: faker.lorem.sentence(),
  uri: faker.image.city(),
  thumbnail: faker.image.city(150, 150)
});

export const createFakeLodgingFacility = (): LegalEntityReference => ({
  legalName: faker.company.companyName(),
  alternativeName: faker.company.companyName(),
  registryCode: faker.random.alphaNumeric(10).toUpperCase(),
  identifiers: iterator(3, createFakeCompanyIdentifier),
  legalType: faker.company.companySuffix(),
  registeredAddress: createFakeAddress(),
  locations: [
    {
      name: 'Main Office',
      description: 'This is our main office',
      address: {
        ...createFakeAddress(),
        geocodes: iterator(2, createFakeGeocode)
      },
      openingHours: iterator(3, createFakeOpeningHours),
      contacts: iterator(1, createFakeContact)
    }
  ],
  contacts: iterator(2, createFakeContact),
  media: {
    logo: faker.image.abstract()
  }
});

export const createFakeSpace = (): OrganizationalUnitReference => ({
  name: faker.company.companyName(),
  type: iterator(3, faker.company.bsNoun),
  description: faker.lorem.lines(2),
  longDescription: faker.lorem.lines(5),
  address: {
    ...createFakeAddress(),
    gps: `${faker.address.latitude()},${faker.address.longitude()}`,
    geocodes: iterator(1, createFakeGeocode)
  },
  openingHours: iterator(2, createFakeOpeningHours),
  contacts: iterator(2, createFakeContact),
  media: {
    logo: faker.image.abstract(),
    images: iterator(5, createFakeImage)
  }
});