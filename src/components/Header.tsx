import React, { Fragment, useEffect, useState } from 'react';
import {
  Link,
  Box,
  Flex,
  Text,
  Button,
  Stack,
  FlexProps,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';

import Logo from 'components/Logo';
import { DarkModeSwitch } from 'components/DarkModeSwitch';
import { useActiveWeb3React } from 'hooks/useWeb3';
import { WalletModal } from 'components/Wallet';
import { shortenAddress } from 'utils';
import Edcoin from 'services/edcoin';

const NavBar = (props: FlexProps) => {
  const { colorMode } = useColorMode();
  const color = { light: 'black', dark: 'white' };
  const textColor = { light: 'white', dark: 'black' };

  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer {...props}>
      <Flex align="center">
        <Logo color={color[colorMode]} />
        <Box mx={3}>
          <DarkModeSwitch />
        </Box>
      </Flex>
      <MenuToggle color={color[colorMode]} toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />{' '}
      <MenuCTA
        isOpen={isOpen}
        textColor={textColor[colorMode]}
        backgroundColor={color[colorMode]}
      />
    </NavBarContainer>
  );
};

const CloseIcon = ({ color }: { color: string }) => (
  <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <title>Close</title>
    <path
      fill={color}
      d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
    />
  </svg>
);

const MenuIcon = ({ color }: { color: string }) => (
  <svg
    width="24px"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
  >
    <title>Menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
);

const MenuToggle = ({
  toggle,
  isOpen,
  color,
}: {
  toggle: () => void;
  isOpen: boolean;
  color: string;
}) => {
  return (
    <Box
      display={{ base: 'block', md: 'none' }}
      cursor="pointer"
      onClick={toggle}
    >
      {isOpen ? <CloseIcon color={color} /> : <MenuIcon color={color} />}
    </Box>
  );
};

const MenuItem = ({
  children,
  isLast,
  to = '/',
  ...rest
}: {
  children: React.ReactNode;
  to: string;
  isLast?: boolean;
}) => {
  return (
    <Link href={to}>
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
};

const MenuLinks = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <Box
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      flexBasis={{ base: '100%', md: 'auto' }}
    >
      <Stack
        spacing={8}
        align="center"
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        pt={[4, 4, 0, 0]}
      >
        <MenuItem to="/">Stake</MenuItem>
        <MenuItem to="#">About</MenuItem>
        <MenuItem to="#">FAQ</MenuItem>
        <MenuItem to="#">Buy Edcoin →</MenuItem>
      </Stack>
    </Box>
  );
};

const MenuCTA = ({
  isOpen,
  backgroundColor,
  textColor,
}: {
  isOpen: boolean;
  backgroundColor: string;
  textColor: string;
}) => {
  const { account } = useActiveWeb3React();
  const [walletState, setWalletState] = useState<string>('');
  const [balance, setBalance] = useState<{
    edcoinBalance: number | string;
    etherBalance: number | string;
  }>({ edcoinBalance: 0, etherBalance: 0 });
  const { onOpen, isOpen: isModalOpen, onClose } = useDisclosure();

  const handleWalletModalOpen = (state: string) => {
    setWalletState(state);
    onOpen();
  };

  useEffect(() => {
    const edcoinContract = new Edcoin();
    const loadBalance = async () => {
      // @ts-ignore
      if (account) {
        const edcoinBalance = await edcoinContract.getBalance(account);
        const etherBalance = await edcoinContract.getEtherBalance(account);
        setBalance({
          edcoinBalance: edcoinBalance.toString(),
          etherBalance: etherBalance.toString(),
        });
      }
    };
    loadBalance();
  }, [balance, account]);

  return (
    <Fragment>
      <Box
        display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
        flexBasis={{ base: '100%', md: 'auto' }}
      >
        {account ? (
          <Stack
            align="center"
            justify={['center', 'space-around', 'flex-end', 'flex-end']}
            direction={['column', 'row', 'row', 'row']}
            pt={[4, 4, 0, 0]}
          >
            <Box
              cursor="pointer"
              rounded={5}
              py={1}
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              px={4}
            >
              <Text color={textColor} fontWeight={600}>
                {balance.edcoinBalance} EDC
              </Text>
            </Box>
            <Box
              cursor="pointer"
              rounded={5}
              py={1}
              px={4}
              bgColor={backgroundColor}
            >
              <Text color={textColor} fontWeight={600}>
                {balance.etherBalance} ETH
              </Text>
            </Box>
            <Box
              cursor="pointer"
              onClick={() => handleWalletModalOpen('wallet')}
              rounded={5}
              py={1}
              px={4}
              bgColor={backgroundColor}
            >
              <Text color={textColor} fontWeight={600}>
                {shortenAddress(account)}
              </Text>
            </Box>
          </Stack>
        ) : (
          <Stack
            spacing={8}
            align="center"
            justify={['center', 'space-between', 'flex-end', 'flex-end']}
            direction={['column', 'row', 'row', 'row']}
            pt={[4, 4, 0, 0]}
          >
            <Button
              onClick={() => handleWalletModalOpen('connect')}
              size="sm"
              rounded="md"
              color={['primary.500', 'primary.500', 'white', 'white']}
              bg={['white', 'white', 'blue.500', 'blue.500']}
              _hover={{
                textDecoration: 'none',
                bg: ['blue.100', 'blue.100', 'blue.600', 'blue.600'],
              }}
            >
              Connect wallet
            </Button>
          </Stack>
        )}
      </Box>
      <WalletModal state={walletState} isOpen={isModalOpen} onClose={onClose} />
    </Fragment>
  );
};

const NavBarContainer = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.50', dark: 'gray.900' };
  const color = { light: 'black', dark: 'white' };

  return (
    <Flex
      as="nav"
      position="fixed"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      p={4}
      zIndex={99}
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default NavBar;
