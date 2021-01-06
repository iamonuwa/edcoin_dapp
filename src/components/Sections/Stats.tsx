import React from 'react';
import {
  Box,
  Stack,
  Flex,
  FlexProps,
  Text,
  Heading,
  useColorMode,
} from '@chakra-ui/react';

export const StatsGrid = ({ ...rest }: FlexProps) => {
  const { colorMode } = useColorMode();
  const color = { light: 'black', dark: 'white' };
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
            borderWidth={1}
            width={300}
            height={150}
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
              Total Edcoin
            </Heading>
          </Box>
          <Box
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
              Total Edcoin Staked
            </Heading>
          </Box>
          <Box
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
              Your staked Edcoin
            </Heading>
          </Box>
          <Box
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
          <Box
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
              Referrals
            </Heading>
          </Box>
        </Flex>
      </Stack>
    </Flex>
  );
};
