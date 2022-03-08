import type { Meta, Story } from '@storybook/react';
import { SwitchThemeMode } from '../components/SwitchThemeMode';

export default {
  title: 'Components/SwitchThemeMode',
  component: SwitchThemeMode,
} as Meta;

const Template: Story = args =>
  <SwitchThemeMode {...args} />
;

export const SwitchOn = Template.bind({});
SwitchOn.args = {};

export const SwitchOff = Template.bind({});
SwitchOff.args = {};
