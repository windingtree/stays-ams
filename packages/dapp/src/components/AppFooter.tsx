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
      <Box align='center' margin={{ bottom: 'small' }}>
        <Text size='large'>
          Created with 💖 for <a href="https://devconnect.org/">Devconnect</a>
        </Text>
        <Text size='large'>
          April 17&ndash;28, Amsterdam
        </Text>
      </Box>

      <Box align='center' direction='row'>
        <Anchor
          icon={<Image src='https://raw.githubusercontent.com/windingtree/branding/master/winding-tree/svg/winding-tree-symbol-dark.svg' height='32px' />}
          href='https://windingtree.com'
          title='Powered by Winding Tree'
          target="_blank"
        />
        <Anchor
          icon={<Image src='/discord-logo.svg' height='32px' />}
          href='https://discord.gg/RWqqzT3Gf8'
          target="_blank"
          title='Join our Discord to Learn More'
        />
        <Anchor
          icon={<Image src='/twitter.svg' height='32px' />}
          href='https://twitter.com/windingtree'
          target="_blank"
          title='Follow Winding Tree on Twitter'
        />
      </Box>
    </Footer>
  );
};
