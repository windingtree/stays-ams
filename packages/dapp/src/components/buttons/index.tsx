import { Button } from 'grommet';
import styled from 'styled-components';

const StyledButton = styled(Button)`
height: 2.5rem;
color: black;
border: 1px solid black;
border-radius: 2.5rem;
&:hover,&:active {
  box-shadow: 0px 0px 0px 2px black;
}
`;

const WhiteButton = styled(StyledButton)`
background: white;
`;

export {
  StyledButton,
  WhiteButton
}