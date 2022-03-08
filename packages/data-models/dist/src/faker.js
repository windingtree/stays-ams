"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeSpace = exports.createFakeLodgingFacility = exports.createFakeImage = exports.createFakeContact = exports.createFakeMessenger = exports.createFakeOpeningHours = exports.createFakeGeocode = exports.createFakeAddress = exports.createFakeCompanyIdentifier = exports.iterator = void 0;
const faker_1 = require("@faker-js/faker");
const iterator = (count, callback) => Array(count).fill(null).map(() => callback());
exports.iterator = iterator;
const createFakeCompanyIdentifier = () => ({
    type: faker_1.faker.random.alphaNumeric(4).toUpperCase(),
    value: faker_1.faker.random.alphaNumeric(10)
});
exports.createFakeCompanyIdentifier = createFakeCompanyIdentifier;
const createFakeAddress = () => ({
    country: faker_1.faker.address.countryCode(),
    subdivision: faker_1.faker.datatype.number({ max: 100 }).toString(),
    locality: faker_1.faker.address.cityName(),
    postalCode: faker_1.faker.address.zipCode(),
    streetAddress: faker_1.faker.address.streetAddress(),
    premise: faker_1.faker.address.secondaryAddress()
});
exports.createFakeAddress = createFakeAddress;
const createFakeGeocode = () => ({
    'type': faker_1.faker.random.alpha(3),
    'value': `${faker_1.faker.random.alphaNumeric(8)} ${faker_1.faker.address.cityName()}`
});
exports.createFakeGeocode = createFakeGeocode;
const createFakeOpeningHours = () => ({
    weekDay: (0, exports.iterator)(3, () => faker_1.faker.date.weekday({ context: true }).toLowerCase()).join(','),
    hours: faker_1.faker.datatype.boolean() ? '9:00-18:00' : '9:00-15:00'
});
exports.createFakeOpeningHours = createFakeOpeningHours;
const createFakeMessenger = () => ({
    type: 'whatsapp',
    value: faker_1.faker.phone.phoneNumber()
});
exports.createFakeMessenger = createFakeMessenger;
const createFakeContact = () => ({
    function: faker_1.faker.name.jobTitle(),
    name: faker_1.faker.name.findName(),
    phone: faker_1.faker.phone.phoneNumber(),
    email: faker_1.faker.internet.email(),
    messengers: (0, exports.iterator)(3, exports.createFakeMessenger)
});
exports.createFakeContact = createFakeContact;
const createFakeImage = () => ({
    description: faker_1.faker.lorem.sentence(),
    uri: faker_1.faker.image.city(),
    thumbnail: faker_1.faker.image.city(150, 150)
});
exports.createFakeImage = createFakeImage;
const createFakeLodgingFacility = () => ({
    legalName: faker_1.faker.company.companyName(),
    alternativeName: faker_1.faker.company.companyName(),
    registryCode: faker_1.faker.random.alphaNumeric(10).toUpperCase(),
    identifiers: (0, exports.iterator)(3, exports.createFakeCompanyIdentifier),
    legalType: faker_1.faker.company.companySuffix(),
    registeredAddress: (0, exports.createFakeAddress)(),
    locations: [
        {
            name: 'Main Office',
            description: 'This is our main office',
            address: Object.assign(Object.assign({}, (0, exports.createFakeAddress)()), { geocodes: (0, exports.iterator)(2, exports.createFakeGeocode) }),
            openingHours: (0, exports.iterator)(3, exports.createFakeOpeningHours),
            contacts: (0, exports.iterator)(1, exports.createFakeContact)
        }
    ],
    contacts: (0, exports.iterator)(2, exports.createFakeContact),
    media: {
        logo: faker_1.faker.image.abstract()
    }
});
exports.createFakeLodgingFacility = createFakeLodgingFacility;
const createFakeSpace = () => ({
    name: faker_1.faker.company.companyName(),
    type: (0, exports.iterator)(3, faker_1.faker.company.bsNoun),
    description: faker_1.faker.lorem.lines(2),
    longDescription: faker_1.faker.lorem.lines(5),
    address: Object.assign(Object.assign({}, (0, exports.createFakeAddress)()), { gps: `${faker_1.faker.address.latitude()},${faker_1.faker.address.longitude()}`, geocodes: (0, exports.iterator)(1, exports.createFakeGeocode) }),
    openingHours: (0, exports.iterator)(2, exports.createFakeOpeningHours),
    contacts: (0, exports.iterator)(2, exports.createFakeContact),
    media: {
        logo: faker_1.faker.image.abstract(),
        images: (0, exports.iterator)(5, exports.createFakeImage)
    }
});
exports.createFakeSpace = createFakeSpace;
//# sourceMappingURL=faker.js.map