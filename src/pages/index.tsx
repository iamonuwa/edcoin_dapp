import React from 'react';
import dynamic from 'next/dynamic';
import { Container } from 'components/Container';
import { StatsGrid } from 'components/Sections/Stats';

const StakeFeatures = dynamic(
  () => import('components/Sections/StakeFeatures'),
  { ssr: false }
);

const Index = () => (
  <Container minHeight="100vh">
    <title>Edcoin - Stake</title>
    <StatsGrid />
    <StakeFeatures />
  </Container>
);

export default Index;
