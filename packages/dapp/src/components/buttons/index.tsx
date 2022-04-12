import { Button } from 'grommet';
import styled from 'styled-components';

export const WhiteButton = styled(Button)`
height: 2.5rem;
background: white;
color: black;
border: 1px solid black;
border-radius: 2.5rem;
&:hover,&:active {
  box-shadow: 0px 0px 0px 2px black;
}
`;
