import { PageWrapper } from './PageWrapper';
import { SearchForm } from '../components/search/SearchForm';
import { Image, Box, Spinner, Text } from 'grommet';
import { SearchResultCard } from '../components/SearchResultCard';
import { useAppState } from '../store';
import { useSpaceSearch } from '../hooks/useSpaceSearch';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageBox } from '../components/MessageBox';
import { useDayZero } from '../hooks/useDayZero';
import { GradientText, WhiteText } from './Home';
import styled from 'styled-components';

export const WhiteParagraph = styled(Text)`
  text-align: start;
  align-self: center;
  color: #fff;
  font-family: Inter;
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;
  letter-spacing: 0px;
  max-width: 50rem;
  margin-top: 5rem;
`;

export const WhiteParagraph18 = styled(Text)`
  text-align: start;
  align-self: center;
  color: #fff;
  font-family: Inter;
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
  max-width: 50rem;
  margin-top: 2rem;
`;

export const Search = () => {
  const { searchSpaces, provider, ipfsNode } = useAppState();
  const { search } = useLocation();

  const { startDay, numberOfDays, guestsAmount } = useMemo(() => {
    const params = new URLSearchParams(search)
    const startDay = Number(params.get('startDay'))
    const numberOfDays = Number(params.get('numberOfDays'))
    return {
      startDay,
      numberOfDays,
      guestsAmount: Number(params.get('guestsAmount')),
    }
  }, [search])

  const [loading, error] = useSpaceSearch(startDay, numberOfDays, guestsAmount)
  const [getDate, isGetDateReady] = useDayZero(provider, ipfsNode);

  const filteredSpaces = useMemo(() => {
    return searchSpaces.filter((space: any) => space.capacity >= guestsAmount)
  }, [searchSpaces, guestsAmount])

  return (
    <PageWrapper
      breadcrumbs={[
        {
          path: '/',
          label: 'Home'
        }
      ]}
    >
      <Box
        style={{
          // position: 'relative',
          background: '#611FF2',
          height: '90vh',
        }}
      >
        <WhiteText margin={{ top: 'medium' }}>April 18-25 2022</WhiteText>
        <WhiteText>Devconnect APRIL 18-25, 2022 Amsterdam, The Netherlands</WhiteText>
        <GradientText>Amsterdam</GradientText>
        <WhiteText>A collaborative Ethereum week, built by and for everyone</WhiteText>

        <WhiteParagraph>
          Devconnect Amsterdam brings together hundreds of people from all over the world. Within one week there will be held various independent Ethereum events as well as in-person gatherings with the focus on communication, learning and making progress on specific subjects.
        </WhiteParagraph>
        <WhiteParagraph18>
          With Win.so you can on-chain your stay in Amsterdam during Devconnect. Book with us. Pay in DAI. Check-in with NFT. Get Rewards for the next ETH event.
        </WhiteParagraph18>

        {isGetDateReady && <SearchForm
          getDate={getDate}
          startDay={startDay}
          numberOfDays={numberOfDays}
          initGuestsAmount={guestsAmount}
        />}
        {isGetDateReady && <Image
          fit="cover"
          src='/bg-img.svg'
          color='#611FF2'
          style={{
            width: '100vw',
            // height: '100vh',
            position: 'absolute',
            left: '0',
            bottom: '-2rem',
            zIndex: '-100'
          }}
        />}

        <MessageBox type='error' show={!!error}>
          <Box direction='row'>
            <Box>
              {error}
            </Box>
          </Box>
        </MessageBox>
      </Box>

      <Box
        style={{
          // position: 'absolute',
          marginTop: '3rem'
        }}
      >
        {loading ? <Spinner color='accent-1' alignSelf='center' size='medium' /> : null}
        {filteredSpaces !== undefined && isGetDateReady ? filteredSpaces.map((space) =>
          <SearchResultCard key={space.contractData.spaceId} space={space} />
        ) : null}
      </Box>
    </PageWrapper>
  );
};
