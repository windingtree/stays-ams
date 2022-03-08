# `combineReducers` utility

A utility dedicated to combining reducers. This feature allows structuring reducers and makes the support of a code easier.

## Usage

All reducers must have a common interface:

```typescript
type DappReducer = Reducer<State, Action>;
```

A combined reducer must be provided to the `useReducer` react hook. The state is passing through reducers from top to down.


```typescript
export const useAppReducer = () => {

  return useReducer(
    combineReducers(
      [
        mainReducer,
        // anotherReducer1,
        // anotherReducer2,
        // anotherReducer3,
      ]
    ),
    {
      ...initialState,
      ...storedState
    }
  );
};
```
