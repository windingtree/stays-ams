import type { Meta, Story } from '@storybook/react';
import type { AccountProps }  from '../../components/Account';
import { Account } from '../../components/Account';

export default {
  title: 'Components/Buttons/Web3ModalSignIn',
  component: Account,
} as Meta;

const Template: Story<AccountProps> = args => <Account {...args} />;

export const LoggedInAccount = Template.bind({});
LoggedInAccount.args = {
  account: '0x567Eb9E8D8A43C24c7bac4cb4b51ca806cFE8996'
};

export const LoggedOutAccount = Template.bind({});
LoggedOutAccount.args = {};
