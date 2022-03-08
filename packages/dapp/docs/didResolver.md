# ORGiD DID resolution feature

## APIs

### hook `useDidResolverHistory`

Allows to add and remove resolution results records to the state (`resolverHistory` property).

This hook returns an array with the following interface:

- `add(record)`: function for adding records. Record will be validated against the schema and added to the state with an unique Id. In a case of success this function will return a record `id` and `undefined` otherwise.
- `remove(id)`: function that removes a record by Id. Returns an `id` in case of success and `undefined` otherwise.
- `loading`: boolean, process indicator
- `error`: action error, `undefined` by default

### hook `useDidResolver`

Makes DID resolution requests.

This hook returns an array with the following interface:

- `resolve(did)`: async function, makes resolution. `did` will be validated.
- `loading`: boolean, process indicator
- `error`: action error, `undefined` by default
