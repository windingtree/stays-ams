import { Image, Box, Footer, Anchor } from 'grommet';


export const AppFooter = () => {
  return (
    <Footer
      pad='small'
      responsive={true}
      border='top'
      justify='between'
    >
      <Box>
      </Box>

      <Box>
        <Anchor
          icon={<Image src='/discord-icon.png' height='20px' />}
          href='https://discord.gg/RWqqzT3Gf8'
          target="_blank"
        />
      </Box>
    </Footer>
  );
};
