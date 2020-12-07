import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useContract } from '../../common/providers/Edcoin.provider';

export default function Reward() {
  const [{ pendingRewards }, , , withdrawRewards] = useContract();
  const withdraw = React.useCallback(() => {
    withdrawRewards();
  }, [withdrawRewards]);
  return (
    <Container>
      <Row className="justify-content-md-center py-4 text-center">
        <b>Pending Rewards</b>
      </Row>
      <Row className="justify-content-md-center pb-4 text-center">
        {pendingRewards}
      </Row>
      <Row className="justify-content-md-center py-4 text-center">
        <Col xs sm md={3}>
          <Button onClick={withdraw} variant="primary" type="submit">
            Withdraw
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
