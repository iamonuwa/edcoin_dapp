import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useContract } from '../../common/providers/Edcoin.provider';
import { toEther, toBN, formatNumber } from '../../common/utils';

export default function Reward() {
  const [{ accountDividends }, , , , withdrawRewards, reInvest] = useContract();
  const withdraw = React.useCallback(() => {
    withdrawRewards();
  }, [withdrawRewards]);
  return (
    <Container>
      <Row className="justify-content-md-center py-4 text-center">
        <Col xs sm md={3}>
          <Card>
            <Card.Body>
              <b>{formatNumber.format(toEther(toBN(accountDividends)))}</b>
            </Card.Body>
            <Card.Footer>Pending Rewards</Card.Footer>
          </Card>
        </Col>
        <Col xs sm md={3}>
          <div className="py-3">
            <Button onClick={withdraw} variant="outline-primary" type="submit">
              Withdraw
            </Button>
          </div>
          <div>
            <Button onClick={reInvest} variant="outline-primary" type="submit">
              Re-invest
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
