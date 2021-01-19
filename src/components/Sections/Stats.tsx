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
    let totalStaked: string = '0';
    let totalEdcoin: string = '0';
    let totalStakes: string = '0';
    let totalReferrals: string = '0';
    const loadContract = async () => {
      totalStaked = (await stakeContract.getTotalStaked()) as string;
      totalEdcoin = (await edcoinContract.getSupply()) as string;
      console.log('total edcoin', totalEdcoin);
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
        left="flex-start"
        align="center"
      >
        <Flex
          alignItems="center"
          direction="row"
          leftContent="space-between"
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
            bgGradient="linear(to-l, #7928CA, #FF0080)"
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
            bgGradient="linear(to-l, #7928CA, #FF0080)"
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
            bgGradient="linear(to-l, #7928CA, #FF0080)"
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
          {/* <Box
            m={{ base: 1, md: 4 }}
            rounded="lg"
            borderWidth={1}
            height={150}
            width={300}
            color={color[colorMode]}
            flexBasis={['auto', '45%']}
          >
            <Text pt={8} px={8} pb={4} fontSize="lg">
              0
            </Text>
            <Heading
              p={{ base: 0, md: 6 }}
              textAlign={{ base: 'center', md: 'left' }}
              as="h3"
              size="sm"
              mb="2"
            >
              Your Edcoin balance
            </Heading>
          </Box>
           */}
          <Box
            m={{ base: 1, md: 4 }}
            rounded="lg"
            borderWidth={1}
            height={150}
            minWidth={300}
            bgGradient="linear(to-l, #7928CA, #FF0080)"
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
