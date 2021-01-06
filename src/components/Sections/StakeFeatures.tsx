import React from 'react';
import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FlexProps,
  Stack,
} from '@chakra-ui/react';
import { Stake } from './Stake';
import { Unstake } from './Unstake';
import { Reward } from './Reward';

export const StakeFeatures = ({ ...rest }: FlexProps) => {
  return (
    <Flex wrap="nowrap" mt={12} {...rest}>
      <Stack
        spacing={4}
        w={{ base: '90vw', md: '90vw', lg: '100vw' }}
        align={['flex-start', 'flex-start', 'flex-start', 'center']}
      >
        <Tabs isFitted width="90vw">
          <TabList>
            <Tab>Stake</Tab>
            <Tab>Unstake</Tab>
            <Tab>Rewards</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Stake balance={0} />
            </TabPanel>
            <TabPanel>
              <Unstake />
            </TabPanel>
            <TabPanel>
              <Reward />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Flex>
  );
};
