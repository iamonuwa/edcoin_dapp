import { Box, Text } from '@chakra-ui/react';
import React from 'react';

type Props = {
  onClick?: () => void;
  id: string;
  active?: boolean;
  clickable?: boolean;
  color: string;
  link?: string | null;
  header: string;
  subheader: string | null;
  icon?: string;
};

export const Option = ({ onClick, id, header, subheader }: Props) => {
  return (
    <Box
      id={id}
      onClick={onClick}
      cursor="pointer"
      borderWidth={1}
      rounded={5}
      px={5}
      py={3}
      mb={3}
    >
      <Text fontSize="md">{header}</Text>
      <Text fontSize="sm">{subheader}</Text>
    </Box>
  );
};
