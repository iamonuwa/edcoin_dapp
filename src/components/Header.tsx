import React from 'react';
import {
  Link,
  Box,
  Flex,
  Text,
  Button,
  Stack,
  FlexProps,
  useColorMode,
} from '@chakra-ui/react';

import Logo from 'components/Logo';

const NavBar = (props: FlexProps) => {
  const { colorMode } = useColorMode();
  const color = { light: 'black', dark: 'white' };

  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer {...props}>
      <Logo w="100px" color={color[colorMode]} />
      <MenuToggle color={color[colorMode]} toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
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
        <MenuItem to="/">Home</MenuItem>
        <MenuItem to="/how">How It works </MenuItem>
        <MenuItem to="/faetures">Features </MenuItem>
        <MenuItem to="/pricing">Pricing </MenuItem>
        <MenuItem to="/signup" isLast>
          <Button
            size="sm"
            rounded="md"
            color={['primary.500', 'primary.500', 'white', 'white']}
            bg={['white', 'white', 'primary.500', 'primary.500']}
            _hover={{
              bg: ['primary.100', 'primary.100', 'primary.600', 'primary.600'],
            }}
          >
            Create Account
          </Button>
        </MenuItem>
      </Stack>
    </Box>
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
      p={8}
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default NavBar;
