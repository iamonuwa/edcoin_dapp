import { Text, Box, Flex, Button } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import EdcoinStakingContract from 'services/stake';

type Props = {
  account: string | null | undefined;
  amount: number | string;
};

export const Reward = ({ account, amount }: Props) => {
  console.log('Amount ', amount);
  const handleReward = useCallback(async () => {
    const edcoinStakingContract = new EdcoinStakingContract();
    if (Number(amount) > 0) {
      await edcoinStakingContract.withdraw(account);
    }
  }, []);
  return (
    <Flex
      my={{ base: 0, md: 10 }}
      alignItems="center"
      justify={{ base: 'flex-start', md: 'center' }}
    >
      <Box
        mr={{ base: 0, md: 10 }}
        alignContent="center"
        justifyContent="center"
      >
        <Text textAlign="center" fontSize="3xl">
          {amount} EDC
        </Text>
        <Text>Pending Rewards</Text>
      </Box>
      <Button
        disabled={!account}
        size="sm"
        variant="outline"
        onClick={handleReward}
      >
        Claim Reward
      </Button>
    </Flex>
  );
};
