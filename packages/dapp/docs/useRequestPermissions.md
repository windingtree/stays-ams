# useRequestPermissions react hook

React hook for ease use of `wallet_requestPermissions` feature.

## `eth_accounts` permission

For now, this is the only available permission type.

### Usage in a component:

```typescript
export const myComponent = () => {
  const { provider } = useAppState();
  const [
    requestPermissions,
    requestPermissionsLoading,
    requestPermissionsError
  ] = useRequestPermissions(provider);

  return (
    <Button onClick=() => requestPermissions('eth_accounts')>
      Open Metamask accounts dialog
    </Button>
  );
};
```

Clicking on the button will open to the Metamask browser extension accounts selection pop-up.
