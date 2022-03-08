# Working with state records sets

## Actions

Example of state records set:

```typescript
export interface GenericStateRecord {
  id: string;
  [key: string]: unknown;
}

export interface State {
  keys: GenericStateRecord[];
}

const state: State = {
  keys: [
    {
      id: 'uniquestring',
      type: 'AAA'
    }
  ]
};
```

### SET_RECORD

Adds adding of new record.

```typescript
const dispatch = useAppDispatch();

dispatch({
  type: 'SET_RECORD',
  payload: {
    name: 'keys',
    record: {
      id: 'anotheruniquestring',
      type: 'ZZZ'
    }
  }
});

console.log(state);

/*
{
  keys: [
    {
      id: 'uniquestring',
      type: 'AAA'
    },
    {
      id: 'anotheruniquestring',
      type: 'ZZZ'
    }
  ]
}
*/
```

Updating existing record (uniqueness by `id`):

```typescript
dispatch({
  type: 'SET_RECORD',
  payload: {
    name: 'keys',
    record: {
      id: 'uniquestring',
      type: 'ZZZ'
    }
  }
});

console.log(state);

/*
{
  keys: [
    {
      id: 'uniquestring',
      type: 'ZZZ'
    }
  ]
}
*/
```

### REMOVE_RECORD

```typescript
dispatch({
  type: 'REMOVE_RECORD',
  payload: {
    name: 'keys',
    id: 'uniquestring'
  }
});

console.log(state);

/*
{
  keys: []
}
*/
```

## Payload validation

Reducer fails when:
- `payload.name` not provided
- `payload.record` not provided (SET_RECORD case)
- `payload.record.id` not provided (SET_RECORD case)
- `payload.id` not provided (REMOVE_RECORD case)
