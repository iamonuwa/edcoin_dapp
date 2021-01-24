import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Flex,
  FlexProps,
  Text,
  Heading,
  Button,
  useClipboard,
} from '@chakra-ui/react';
import EdcoinStakingContract from 'services/stake';
import { useActiveWeb3React } from 'hooks/useWeb3';
import Edcoin from 'services/edcoin';

export const StatsGrid = ({ ...rest }: FlexProps) => {
  const [stake, setStake] = useState<{
    totalStaked: string;
    totalStakes: string;
    totalEdcoin: string;
    totalReferrals: string;
  }>({
    totalStaked: '0',
    totalStakes: '0',
    totalEdcoin: '0',
    totalReferrals: '0',
  });
  const { account } = useActiveWeb3React();

  const siteUrl: string =
    typeof window !== 'undefined' ? window.location.origin : '';

  const referralCode = `${siteUrl}?referrer=${account}`;
  const { onCopy } = useClipboard(referralCode.toString());

  useEffect(() => {
    const stakeContract = new EdcoinStakingContract();
    const edcoinContract = new Edcoin();
    let totalStaked = '0';
    let totalEdcoin = '0';
    let totalStakes = '0';
    let totalReferrals = '0';

    const loadContract = async () => {
      totalStaked = await stakeContract.getTotalStaked();
      totalEdcoin = await edcoinContract.getSupply();
      if (account) {
        totalStakes = await stakeContract.countStakes(account);
        totalReferrals = await stakeContract.getReferrals(account);
      }
      setStake({
        totalEdcoin,
        totalStaked,
        totalStakes,
        totalReferrals,
      });
    };
    loadContract();
  }, [account]);
  return (
    <Flex wrap="nowrap" mt={100} {...rest}>
      <Stack
        spacing={4}
        w={{ base: '100vw', md: '100vw', lg: '100vw' }}
        align="center"
      >
        <Flex
          alignItems="center"
          direction="row"
          maxW={['100vw', '100vw', '100vw', '90vw']}
          overflowX="scroll"
        >
          <Box
            m={{ base: 1, md: 4 }}
            rounded="lg"
            bgColor="red"
            minWidth={300}
            height={150}
            color="white"
            bgGradient="linear(to-l, #28ca2a, #ffb100)"
            flexBasis={['auto', '45%']}
          >
            <Text pt={8} px={8} pb={4} fontSize="lg">
              {stake.totalEdcoin}
            </Text>
            <Heading
              pt={8}
              px={8}
              pb={4}
              textAlign={{ base: 'left', md: 'left' }}
              as="h3"
              size="sm"
            >
              Total Edcoin
            </Heading>
          </Box>
          <Box
            m={{ base: 1, md: 4 }}
            rounded="lg"
            height={150}
            minWidth={300}
            color="white"
            bgGradient="linear(to-l, #ffb100, #28ca2a)"
            flexBasis={['auto', '45%']}
          >
            <Text pt={8} px={8} pb={4} fontSize="lg">
              {stake.totalStaked}
            </Text>
            <Heading
              pt={8}
              px={8}
              pb={4}
              textAlign={{ base: 'left', md: 'left' }}
              as="h3"
              size="sm"
            >
              Total Edcoin Staked
            </Heading>
          </Box>
          <Box
            m={{ base: 1, md: 4 }}
            rounded="lg"
            height={150}
            minWidth={300}
            color="white"
            bgGradient="linear(to-l, #28ca2a, #ffb100)"
            flexBasis={['auto', '45%']}
          >
            <Text pt={8} px={8} pb={4} fontSize="lg">
              {stake.totalStakes}
            </Text>
            <Heading
              pt={8}
              px={8}
              pb={4}
              textAlign={{ base: 'left', md: 'left' }}
              as="h3"
              size="sm"
            >
              Your staked Edcoin
            </Heading>
          </Box>
          <Box
            m={{ base: 1, md: 4 }}
            rounded="lg"
            height={150}
            minWidth={300}
            bgGradient="linear(to-l, #ffb100, #28ca2a)"
            color="white"
            flexBasis={['auto', '45%']}
          >
            <Text pt={8} px={8} pb={4} fontSize="lg">
              {stake.totalReferrals}
            </Text>
            <Flex
              pt={8}
              px={8}
              pb={4}
              align="center"
              mb="2"
              justify="space-between"
            >
              <Heading
                textAlign={{ base: 'left', md: 'left' }}
                as="h3"
                size="sm"
              >
                Referrals
              </Heading>
              <Button variant="outline" onClick={() => onCopy()} size="xs">
                Copy Referral Link
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Stack>
    </Flex>
  );
};
