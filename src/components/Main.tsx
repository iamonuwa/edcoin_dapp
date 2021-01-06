import React from 'react';
import { Flex, FlexProps, Stack } from '@chakra-ui/react';

export const Main = ({ children, ...rest }: FlexProps) => {
  return (
    <Flex wrap="nowrap" minH="70vh" mb={16} {...rest}>
      <Stack
        spacing={4}
        w={{ base: '100%', md: '50vw' }}
        align={['center', 'center', 'flex-start', 'flex-start']}
      >
        {children}
      </Stack>
    </Flex>
  );
};
