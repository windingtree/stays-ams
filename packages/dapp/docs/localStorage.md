# localStorage connector for the Dapp state

A special connector that can be injected into the Dapp state reducer stack to automatically save configured properties to the browser's local storage.

## Source

`./src/store/localStorage.ts`

## Configuration

Names of properties that must be automatically stored to a localStorage should be enlisted under the `properties` array.

```typescript
export const storageConnectorConfig: LocalStorageConnectorConfig = {
  properties: [
    'keys',
    'resolverHistory',
  ]
};
```

## Utilities

### `safeObjectStringify`

This is a safe version of the `JSON.stringify` that allows serializing objects with circular dependencies and raw Error objects.

```typescript
const obj = { zzz: 1, eee: new Error('AAA'), qqq: 'string' };

console.log(safeObjectStringify(obj, 2))
// '{"zzz":1,"eee":{"stack":"Error: AAA\\n    at <anonymous>:1:26","message":"AAA"},"qqq":"string"}'
```

### `getState`

Fetches a stored state from a localStorage. Sets default (empty) values in the case when the feature has not been initialized yet.

### `setState`

Stores configured state properties to a localStorage.

### `storageReducer`

A middleware dedicated for injection into the Dapp reducers stack.

```typescript
export const useAppReducer = () => {
  const storedState = getState(); // Restoration of the Dapp state

  return useReducer(
    combineReducers(
      [
        mainReducer,
        // anotherReducer1,
        // anotherReducer2,
        // anotherReducer3,
        storageReducer() // Always must be the last
      ]
    ),
    {
      ...initialState,
      ...storedState
    }
  );
};
```

`storageReducer(transform)` initializer can accept `transform` callback that can be used for serialized state data transformation. Using this function a serialized state can be ZIP-ed or encrypted.

Here is the template of the `transform` callback:

```typescript
const defaultTransform = (serializedState: string): string => {
  const transformedState = /* Do something with serialized `serializedState` */;
  return transformedState;
};
```

It is required to create two `transform` functions. One function for normal direction transformation and a second one for reverse transformation.

A callback function for reverse transformation must be provided as an argument to `getState(transform)` utility.
