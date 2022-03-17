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
  "name": "Hessel, Heller and Kozey",
  "description": "Blanditiis officia distinctio omnis.\nDeleniti sint saepe.\nNecessitatibus sit et delectus corrupti.",
  "type": "room",
  "capacity": 4,
  "guestsNumber": 5,
  "beds": 3,
  "price": 59,
  "media": {
    "logo": "http://placeimg.com/640/480/abstract",
    "images": [
      {
        "description": "Quo officiis neque veniam aut cumque non saepe et dolorum.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
      },
      {
        "description": "Fuga dolores velit veritatis dolores sed.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
      },
      {
        "description": "Repellendus maiores officiis.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
      },
      {
        "description": "Voluptatem et accusamus perferendis porro sunt deleniti nihil.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
      },
      {
        "description": "Commodi vel ab culpa laudantium corrupti.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
      }
    ]
  }
}
*/

const fakeLodgingFacility = createFakeLodgingFacility();

/*
{
  "name": "Price, Feest and Harvey",
  "description": "Reiciendis ut cupiditate voluptatibus numquam molestias tenetur non.\nMaxime quis earum autem illum voluptatem voluptas sequi.\nImpedit voluptate accusantium iusto ut voluptatem excepturi perferendis aspernatur.",
  "type": "boatel",
  "tier": "basic",
  "address": {
    "country": "MO",
    "subdivision": "22",
    "locality": "Salina",
    "postalCode": "55919-9454",
    "streetAddress": "968 Selmer Point",
    "premise": "Apt. 851",
    "gps": "42.3028,158.1222"
  },
  "operator": {
    "name": "Franey, Beer and O'Keefe",
    "address": {
      "country": "FO",
      "subdivision": "66",
      "locality": "Augusta-Richmond County",
      "postalCode": "70278-6130",
      "streetAddress": "816 Sipes Junctions",
      "premise": "Suite 316",
      "gps": "-89.5376,143.8844"
    }
  },
  "media": {
    "logo": "http://placeimg.com/640/480/abstract",
    "images": [
      {
        "description": "Aut nostrum et voluptates sed qui ullam ducimus rerum enim.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
      },
      {
        "description": "Dolorum et sint neque eos corrupti et aspernatur deserunt corporis.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
      },
      {
        "description": "Eius doloremque assumenda.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
      },
      {
        "description": "Iste iste quo.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
      },
      {
        "description": "Veritatis et deleniti ad enim velit.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
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
