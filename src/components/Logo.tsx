import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import Image from 'next/image';

export default function Logo(props: BoxProps) {
  return (
    <Box {...props}>
      <Image src="/assets/logo.png" width={48} height={48} />
    </Box>
  );
}
