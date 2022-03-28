"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeSpace = exports.createFakeLodgingFacility = exports.createFakeImage = exports.createFakeAddress = exports.iterator = exports.randomItem = void 0;
const faker_1 = require("@faker-js/faker");
const enum_1 = require("./enum");
const randomItem = (array) => array[Math.floor(Math.random() * array.length)];
exports.randomItem = randomItem;
const iterator = (count, callback) => Array(count).fill(null).map(() => callback());
exports.iterator = iterator;
const createFakeAddress = () => ({
    country: faker_1.faker.address.countryCode(),
    subdivision: faker_1.faker.datatype.number({ max: 100 }).toString(),
    locality: faker_1.faker.address.cityName(),
    postalCode: faker_1.faker.address.zipCode(),
    streetAddress: faker_1.faker.address.streetAddress(),
    premise: faker_1.faker.address.secondaryAddress(),
    gps: `${faker_1.faker.address.latitude()},${faker_1.faker.address.longitude()}`
});
exports.createFakeAddress = createFakeAddress;
const createFakeImage = () => ({
    description: faker_1.faker.lorem.sentence(),
    uri: faker_1.faker.image.city()
});
exports.createFakeImage = createFakeImage;
const createFakeLodgingFacility = () => ({
    name: faker_1.faker.company.companyName(),
    description: faker_1.faker.lorem.lines(3),
    type: (0, exports.randomItem)(enum_1.allowedLodgingFacilityTypes),
    tier: (0, exports.randomItem)(enum_1.allowedLodgingFacilityTiers),
    address: (0, exports.createFakeAddress)(),
    operator: {
        name: faker_1.faker.company.companyName(),
        address: (0, exports.createFakeAddress)()
    },
    media: {
        logo: faker_1.faker.image.abstract(),
        images: (0, exports.iterator)(5, exports.createFakeImage)
    }
});
exports.createFakeLodgingFacility = createFakeLodgingFacility;
const createFakeSpace = () => ({
    name: faker_1.faker.company.companyName(),
    description: faker_1.faker.lorem.lines(3),
    type: (0, exports.randomItem)(enum_1.allowedSpaceTypes),
    capacity: faker_1.faker.datatype.number({ min: 1, max: 5 }),
    guestsNumber: faker_1.faker.datatype.number({ min: 1, max: 5 }),
    beds: faker_1.faker.datatype.number({ min: 1, max: 3 }),
    price: faker_1.faker.datatype.number({ min: 35, max: 250 }).toString(),
    media: {
        logo: faker_1.faker.image.abstract(),
        images: (0, exports.iterator)(5, exports.createFakeImage)
    }
});
exports.createFakeSpace = createFakeSpace;
//# sourceMappingURL=faker.js.map