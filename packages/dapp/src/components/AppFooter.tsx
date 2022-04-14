import { Image, Text, Box, Footer, Anchor } from 'grommet';

export const AppFooter = () => {
  return (
    <Footer
      responsive={true}
      justify='between'
      margin={{ left: 'auto', right: 'auto', bottom: 'xlarge' }}
      pad={{ horizontal: 'small'}}
      width={{ width: '100%', max: '900px' }}
      direction='column'
    >
      <Box align='center' margin={{ bottom: 'large' }}>
        <Text size='large'>
          Created with 💖 for <a href="https://devconnect.org/">Devconnect</a>
        </Text>
        <Text size='large'>
          April 17&ndash;25, Amsterdam
        </Text>
      </Box>

      <Box align='center'>
        <a href="https://windingtree.com">
          <Image
            style={{ height: '32px' }}
            src='https://raw.githubusercontent.com/windingtree/branding/master/winding-tree/svg/winding-tree-symbol-dark.svg'
            alt='Powered by Winding Tree'
            title='Powered by Winding Tree'
          />
        </a>
      </Box>

      <Box align='center'>
        <Anchor
          icon={<Image src='/discord-icon.png' height='20px' />}
          href='https://discord.gg/RWqqzT3Gf8'
          target="_blank"
        />
      </Box>
    </Footer>
  );
};
