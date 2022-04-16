import { Box, Button, Spinner, Text, TextInput } from "grommet";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MessageBox } from "../components/MessageBox";
import { useGetToken } from "../hooks/useMyTokens";
import { useAppState } from "../store";
import { TokenCard, TokenView } from "./MyTokens";
import { PageWrapper } from "./PageWrapper";

export const TokenSearch = ({ tokenId }: { tokenId?: string }) => {
  const navigate = useNavigate();
  const [id, setTokenId] = useState<string>(tokenId || '');

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
          value={id}
          type='number'
          min={1}
          step={1}
          onChange={({ target }) => setTokenId(target.value)}
        />
      </Box>
      <Box>
        <Button
          primary
          label='Search'
          onClick={() => {
            if (tokenId === '') {
              return;
            }
            navigate(
              `/token?tokenId=${id}`,
              { replace: true }
            );
          }}
        />
      </Box>
    </Box>
  );
};

export const Token = () => {
  const { rpcProvider, ipfsNode, lodgingFacilities } = useAppState();
  const [searchParams] = useSearchParams();
  const tokenId = useMemo(
    () => searchParams.get('tokenId') || undefined,
    [searchParams]
  );
  const [token, facilityOwner, tokenLoading, tokenError, refreshToken] = useGetToken(
    rpcProvider,
    ipfsNode,
    tokenId
  );

  const facility = useMemo(
    () => {
      const facilityId = token?.data.attributes?.find((attr) => attr.trait_type === 'facilityId')?.value;
      return lodgingFacilities.find((facility) => facility.id === facilityId?.toLowerCase());
    },
    [token, lodgingFacilities]
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
      <Box align="center" margin={{ bottom: 'large' }}>
        <TokenSearch tokenId={tokenId} />
      </Box>

      <MessageBox type='info' show={tokenLoading}>
        <Box direction='row'>
          <Box margin={{ right: 'small'}}>
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

      {!!token &&
        <Box
          margin={{ top: 'large' }}
        >
          <TokenCard
            facility={facility}
            onClick={() => {}}
            {...token.data}
          >
            <TokenView
              facilityOwner={facilityOwner}
              facility={facility}
              {...token}
              withCloseButton={false}
            />
          </TokenCard>
        </Box>
      }

      {!!token &&
        <Box margin={{ top: 'large' }} width='200px' align="center">
          <Button
            primary
            size="large"
            label='Refresh token'
            onClick={() => refreshToken()}
          />
        </Box>
      }

    </PageWrapper>
  );
};
