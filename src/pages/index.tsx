import React from 'react';

import { Container } from 'components/Container';
import { StakeFeatures } from 'components/Sections/StakeFeatures';
import { StatsGrid } from 'components/Sections/Stats';

const Index = () => (
  <Container minHeight="100vh">
    <StatsGrid />
    <StakeFeatures />
  </Container>
);

export default Index;
