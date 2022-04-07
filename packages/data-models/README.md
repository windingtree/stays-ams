# Stays data models and utilities
> This a private package

## Usage in the monorepo

Dependency in package.json

```json
"dependencies": {
  "stays-data-models": "0.0.1"
}
```

```typescript
import type {
  SpaceRaw, // Original space data type
  LodgingFacilityRaw, // Original lodging facility data type
  Space, // Space storage record typescript type
  LodgingFacility // Lodging facility record typescript type
} from 'stays-data-models';

import {
  schemas, // json.schema's for raw space and lodging facility data
  enumerators, // arrays with allowed data for types
  validators, // ready made validators for data
  faker // helpers for generation of faked data sets
} from 'stays-data-models';
```

## Data schemas

```typescript
import { schemas } from 'stays-data-models';
const {
  spaceSchema,
  lodgingFacilitySchema
} = schemas;
```

## Faker

```typescript
import { faker } from 'stays-data-models';
const {
  iterator,
  createFakeSpace,
  createFakeLodgingFacility,
  ...// etc.
} = faker;

const fakeSpace = createFakeSpace();

/*
{
  "name": "Reinger and Sons",
  "description": "Repellat enim sed voluptate doloribus ut ab voluptatem voluptates quia.\nNeque sit labore rerum facere.\nOdio nam enim occaecati adipisci numquam itaque corrupti.",
  "type": "suite",
  "amenities": [
    "web-readiness",
    "e-tailers",
    "web services",
    "relationships",
    "infomediaries",
    "web-readiness"
  ],
  "capacity": 4,
  "guestsNumber": 2,
  "beds": 1,
  "price": "246",
  "media": {
    "logo": "http://placeimg.com/640/480/abstract",
    "images": [
      {
        "description": "Similique sint molestias ea quo.",
        "uri": "http://placeimg.com/640/480/city"
      },
      {
        "description": "Animi non ut.",
        "uri": "http://placeimg.com/640/480/city"
      },
      {
        "description": "Dolorem aut corporis quod omnis aliquid cupiditate.",
        "uri": "http://placeimg.com/640/480/city"
      },
      {
        "description": "Laborum fugit tempore.",
        "uri": "http://placeimg.com/640/480/city"
      },
      {
        "description": "Autem possimus aliquid officiis qui ut rerum id illo mollitia.",
        "uri": "http://placeimg.com/640/480/city"
      }
    ]
  }
}
*/

const fakeLodgingFacility = createFakeLodgingFacility();

/*
{
  "name": "Reynolds Group",
  "description": "At delectus eum cumque quia qui non.\nVoluptas optio debitis ea aut porro aperiam.\nDucimus rerum molestias veritatis placeat consequuntur quisquam corporis possimus repellat.",
  "type": "guest_house",
  "tier": "decent",
  "amenities": [
    "e-services",
    "blockchains",
    "markets",
    "markets",
    "networks",
    "web-readiness"
  ],
  "contact": {
    "name": "Movies",
    "phone": "450.363.3045 x30092",
    "email": "Viola20@hotmail.com",
    "website": "https://fragrant-permission.info",
    "messengers": [
      {
        "type": "whatsapp",
        "value": "267.993.8461"
      }
    ]
  },
  "address": {
    "country": "UZ",
    "subdivision": "30",
    "locality": "Gainesville",
    "postalCode": "41478-5650",
    "streetAddress": "8248 Lemke Extensions",
    "premise": "Apt. 806",
    "gps": "-63.1155,-91.7161"
  },
  "operator": {
    "name": "Brakus, Schulist and Stokes",
    "address": {
      "country": "VN",
      "subdivision": "43",
      "locality": "Shawnee",
      "postalCode": "26931-3547",
      "streetAddress": "01481 Kessler Flat",
      "premise": "Suite 532",
      "gps": "-47.3658,28.5284"
    }
  },
  "media": {
    "logo": "http://placeimg.com/640/480/abstract",
    "images": [
      {
        "description": "In perspiciatis non.",
        "uri": "http://placeimg.com/640/480/city"
      },
      {
        "description": "Quidem facere necessitatibus maxime natus minus aut.",
        "uri": "http://placeimg.com/640/480/city"
      },
      {
        "description": "Numquam consequuntur qui eum mollitia vel aperiam ratione.",
        "uri": "http://placeimg.com/640/480/city"
      },
      {
        "description": "Neque quo dolore sed impedit aspernatur.",
        "uri": "http://placeimg.com/640/480/city"
      },
      {
        "description": "Dolor fugit mollitia quo nobis iste id nobis amet.",
        "uri": "http://placeimg.com/640/480/city"
      }
    ]
  }
}
*/
```

> `faker.iterator(number,callback)` - runs callback a number of tiles and return an array of results. Useful for generation sets of objects or anything

```typescript
iterator(
  3,
  callback
);

/*
[
  { ... },
  { ... },
  { ... }
]
*/
```

## Enumerators

```typescript
import { enumerators } from 'stays-data-models';
const {
  allowedLodgingFacilityTypes, // Lodging facility types
  allowedLodgingFacilityTiers, // Lodging facility tiers
  allowedSpaceTypes // Space types
} = enumerators;
```

## Validators

```typescript
import { validators } from 'stays-data-models';
const {
  validateSpaceData,
  validateLodgingFacilityData
} = validators;

const data = createFakeSpace();
validateSpaceData(data); // Should throw an `Validation error:` in case of malformed data
```
