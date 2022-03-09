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
  Space, // Space storage record typescript type
  LodgingFacility // Lodging facility record typescript type
} from 'stays-data-model';

import {
  schemas, // json.schema's for raw space and lodging facility data
  validators, // ready made validators for data
  faker // helpers for generation of faked data sets
} from 'stays-data-model';
```

## Data schemas

```typescript
import {
  schemas: {
    spaceSchema,
    lodgingFacilitySchema
  }
} from 'stays-data-model';
```

## Faker

```typescript
import {
  faker: {
    iterator,
    createFakeSpace,
    createFakeLodgingFacility,
    ...// createFakeCompanyIdentifier, createFakeAddress, createFakeContact... etc.
  }
} from 'stays-data-model';

const fakeSpace = createFakeSpace();

/*
{
  "name": "Cremin Group",
  "type": [
    "communities",
    "e-services",
    "blockchains"
  ],
  "description": "Saepe sequi ab illum iure.\nEligendi velit quidem.",
  "longDescription": "Ducimus velit quia ducimus recusandae.\nNostrum explicabo illum cumque occaecati ipsum omnis atque.\nImpedit natus et cum soluta consequatur voluptatum culpa adipisci omnis.\nEsse illum expedita consectetur perferendis.\nOmnis incidunt ut ut laboriosam.",
  "address": {
    "country": "BN",
    "subdivision": "83",
    "locality": "Burke",
    "postalCode": "06128-6690",
    "streetAddress": "0056 Amir Common",
    "premise": "Suite 280",
    "gps": "-35.0422,-118.5810",
    "geocodes": [
      {
        "type": "tun",
        "value": "5klkkyxd Longview"
      }
    ]
  },
  "openingHours": [
    {
      "weekDay": "tuesday,tuesday,monday",
      "hours": "9:00-18:00"
    },
    {
      "weekDay": "monday,monday,saturday",
      "hours": "9:00-18:00"
    }
  ],
  "contacts": [
    {
      "function": "District Implementation Engineer",
      "name": "Stanley Wilderman",
      "phone": "(929) 207-8371",
      "email": "Domenick.Zieme80@hotmail.com",
      "messengers": [
        {
          "type": "whatsapp",
          "value": "1-865-398-9198 x763"
        },
        {
          "type": "whatsapp",
          "value": "1-737-350-4370"
        },
        {
          "type": "whatsapp",
          "value": "889-202-6590"
        }
      ]
    },
    {
      "function": "Central Accounts Associate",
      "name": "James Leffler",
      "phone": "1-882-866-5035 x66202",
      "email": "Rico28@gmail.com",
      "messengers": [
        {
          "type": "whatsapp",
          "value": "(771) 807-5698 x78420"
        },
        {
          "type": "whatsapp",
          "value": "1-420-970-6875 x16999"
        },
        {
          "type": "whatsapp",
          "value": "914.762.8775 x32144"
        }
      ]
    }
  ],
  "media": {
    "logo": "http://placeimg.com/640/480/abstract",
    "images": [
      {
        "description": "Illum est suscipit assumenda est doloribus porro.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
      },
      {
        "description": "Beatae veritatis et necessitatibus doloribus blanditiis animi deserunt hic.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
      },
      {
        "description": "Voluptatum officia commodi.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
      },
      {
        "description": "Molestiae fuga suscipit ut.",
        "uri": "http://placeimg.com/640/480/city",
        "thumbnail": "http://placeimg.com/150/150/city"
      },
      {
        "description": "Sed repudiandae necessitatibus perspiciatis eos.",
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
  "legalName": "Heathcote - Robel",
  "alternativeName": "Bartoletti - Bogan",
  "registryCode": "W1SH3F0MMT",
  "identifiers": [
    {
      "type": "Z8AO",
      "value": "q88ahia9j2"
    },
    {
      "type": "3VLI",
      "value": "b2qyiinap8"
    },
    {
      "type": "3UOS",
      "value": "3haxwuq9aa"
    }
  ],
  "legalType": "LLC",
  "registeredAddress": {
    "country": "HT",
    "subdivision": "81",
    "locality": "Roswell",
    "postalCode": "36810-4604",
    "streetAddress": "6629 Katelin Point",
    "premise": "Suite 968"
  },
  "locations": [
    {
      "name": "Main Office",
      "description": "This is our main office",
      "address": {
        "country": "EE",
        "subdivision": "94",
        "locality": "Washington",
        "postalCode": "53007",
        "streetAddress": "616 Sonny Shoals",
        "premise": "Apt. 796",
        "geocodes": [
          {
            "type": "kvw",
            "value": "h9j9itxn Spring"
          },
          {
            "type": "tbm",
            "value": "70nrrlfo Indio"
          }
        ]
      },
      "openingHours": [
        {
          "weekDay": "tuesday,tuesday,thursday",
          "hours": "9:00-15:00"
        },
        {
          "weekDay": "wednesday,wednesday,saturday",
          "hours": "9:00-18:00"
        },
        {
          "weekDay": "monday,tuesday,saturday",
          "hours": "9:00-18:00"
        }
      ],
      "contacts": [
        {
          "function": "Internal Integration Architect",
          "name": "Melinda Lakin",
          "phone": "(422) 956-9383 x2701",
          "email": "Abe.Blanda@yahoo.com",
          "messengers": [
            {
              "type": "whatsapp",
              "value": "299.694.8964"
            },
            {
              "type": "whatsapp",
              "value": "1-637-857-1873 x32232"
            },
            {
              "type": "whatsapp",
              "value": "852.328.4829 x714"
            }
          ]
        }
      ]
    }
  ],
  "contacts": [
    {
      "function": "Legacy Marketing Administrator",
      "name": "Fred Littel",
      "phone": "485-321-5479",
      "email": "Bonita_Champlin81@hotmail.com",
      "messengers": [
        {
          "type": "whatsapp",
          "value": "458.217.6926"
        },
        {
          "type": "whatsapp",
          "value": "(465) 913-2206 x5782"
        },
        {
          "type": "whatsapp",
          "value": "833-214-3453 x23686"
        }
      ]
    },
    {
      "function": "Human Identity Director",
      "name": "Drew Kozey I",
      "phone": "264.508.0309",
      "email": "Cullen.Okuneva@hotmail.com",
      "messengers": [
        {
          "type": "whatsapp",
          "value": "582-223-6716"
        },
        {
          "type": "whatsapp",
          "value": "793.327.8458 x06767"
        },
        {
          "type": "whatsapp",
          "value": "(567) 269-3481 x3518"
        }
      ]
    }
  ],
  "media": {
    "logo": "http://placeimg.com/640/480/abstract"
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

## Validators

```typescript
import {
  validators: {
    validateSpaceData,
    validateLodgingFacilityData
  }
} from 'stays-data-model';

const data = createFakeSpace();
validateSpaceData(data); // Should throw an `Validation error:` in case of malformed data
```