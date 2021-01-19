import React from 'react';

import { Container } from 'components/Container';
import { StakeFeatures } from 'components/Sections/StakeFeatures';
import { StatsGrid } from 'components/Sections/Stats';

const Index = () => (
  <Container minHeight="100vh">
    <title>Edcoin - Stake</title>
    <StatsGrid />
    <StakeFeatures />
  </Container>
);

export default Index;
