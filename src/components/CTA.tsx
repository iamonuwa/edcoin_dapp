import { Link as ChakraLink, Button, Text } from '@chakra-ui/react';

import { Container } from 'components/Container';
import { Footer } from './Footer';

export const CTA = () => (
  <Container
    flexDirection="row"
    position="fixed"
    bottom="0"
    width="100vw"
    py={2}
  >
    <Footer flexGrow={1} position="fixed" bottom={10}>
      <Text>&copy; 2021 Edcoin</Text>
    </Footer>
  </Container>
);
