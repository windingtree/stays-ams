# Core EthRio stays library

## Usage in the monorepo

Dependency in package.json

```json
"dependencies": {
  "stays-core": "0.0.1"
}
```

## Initialization

```typescript
import { EthRioContract } from 'stays-core';

const contract = new EthRioContract(
  '<SMART_CONTRACT_ADDRESS>',
  '<JSON_RPC_PROVIDER_URI>',
  ipfsNode
);
```

### API

```typescript
getLodgingFacilityIds(active: boolean): Promise<string[]
```

```typescript
getSpaceIds(lodgingFacilityId: string, active: boolean): Promise<string[]
```

```typescript
getAvailability(spaceId: string, startDay: number, numberOfDays: number): Promise<number[]>
```

```typescript
getLodgingFacility(lodgingFacilityId: string): Promise<LodgingFacility | null>
```

```typescript
getSpace(spaceId: string): Promise<Space | null>
```