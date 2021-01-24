import React, { useEffect, useState } from 'react';
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
import Edcoin from 'services/edcoin';
import { useActiveWeb3React } from 'hooks/useWeb3';
import EdcoinStakingContract from 'services/stake';

const StakeFeatures = ({ ...rest }: FlexProps) => {
  const [balance, setBalance] = useState<number | string>(0);
  const [rewards, setRewards] = useState<number | string>(0);
  const [totalStaked, setTotalStaked] = useState<number | string>(0);
  const { account } = useActiveWeb3React();
  useEffect(() => {
    const edcoinContract = new Edcoin();
    const edcoinStakingContract = new EdcoinStakingContract();
    const loadContract = async () => {
      if (account) {
        const balance = await edcoinContract.getBalance(account);
        const formatBalance = balance.toString();
        const rewards = await edcoinStakingContract.computeEarnings(account);
        const totalStaked = await edcoinStakingContract.countStakes(account);
        setBalance(formatBalance);
        setRewards(rewards);
        setTotalStaked(totalStaked);
      }
    };
    loadContract();
  }, [balance, account]);
  return (
    <Flex wrap="nowrap" mt={12} {...rest}>
      <Stack
        spacing={4}
        w={{ base: '100vw', md: '90vw', lg: '100vw' }}
        align={['flex-start', 'flex-start', 'flex-start', 'center']}
      >
        <Tabs isFitted width={{ base: '100vw', md: '87vw' }} outline="none">
          <TabList>
            <Tab _selected={{ borderBottomColor: '#28ca2a' }}>Stake</Tab>
            <Tab _selected={{ borderBottomColor: '#28ca2a' }}>Unstake</Tab>
            <Tab _selected={{ borderBottomColor: '#28ca2a' }}>Rewards</Tab>
          </TabList>
          <TabPanels outline="none">
            <TabPanel id="1">
              <Stake account={account} balance={balance} />
            </TabPanel>
            <TabPanel id="2">
              <Unstake account={account} balance={totalStaked} />
            </TabPanel>
            <TabPanel id="3">
              <Reward account={account} amount={rewards} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Flex>
  );
};

export default StakeFeatures;
