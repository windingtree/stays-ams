import { Box, Button, Spinner, Text, TextInput } from "grommet";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MessageBox } from "../components/MessageBox";
import { useGetToken } from "../hooks/useMyTokens";
import { useAppState } from "../store";
import { PageWrapper } from "./PageWrapper";

export const TokenSearch = () => {
  const navigate = useNavigate();
  const [tokenId, setTokenId] = useState<string>('');

  return (
    <Box
      width={{
        max: '200px'
      }}
      direction="column"
    >
      <Box>
        <Text size="large" weight='bold'>
          Token Id:
        </Text>
      </Box>
      <Box
        background='white'
        margin={{ bottom: 'small' }}
      >
        <TextInput
          size="xlarge"
          value={tokenId}
          type='number'
          min={1}
          step={1}
          onChange={({ target }) => setTokenId(target.value)}
        />
      </Box>
      <Box>
        <Button
          label='Search'
          onClick={() => {
            if (tokenId === '') {
              return;
            }
            navigate(
              `/token?tokenId=${tokenId}`,
              { replace: true }
            );
          }}
        />
      </Box>
    </Box>
  );
};

export const Token = () => {
  const { rpcProvider, ipfsNode } = useAppState();
  const [searchParams] = useSearchParams();
  const tokenId = useMemo(
    () => searchParams.get('tokenId') || undefined,
    [searchParams]
  );
  const [token, facilityOwner, tokenLoading, tokenError] = useGetToken(
    rpcProvider,
    ipfsNode,
    tokenId
  );

  return (
    <PageWrapper
      breadcrumbs={[
        {
          path: "/",
          label: "Home",
        },
      ]}
    >
      <MessageBox type='info' show={tokenLoading}>
        <Box direction='row'>
          <Box margin={{ right: 'small '}}>
            Token data is loading. Please wait..
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      <MessageBox type='error' show={!!tokenError}>
        <Box>
          {tokenError}
        </Box>
      </MessageBox>

      <Box align="center">
        <TokenSearch />
      </Box>

      <Box
        margin={{ top: 'large' }}
      >
        [{tokenId}][{JSON.stringify(token)}]
      </Box>

    </PageWrapper>
  );
};
