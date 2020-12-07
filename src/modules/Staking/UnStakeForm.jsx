import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useContract } from '../../common/providers/Edcoin.provider';

export default function StakeForm() {
  const [state, setState] = React.useState(0);

  const [, , stakeEdcoin] = useContract();

  const handleUnStake = React.useCallback(
    (e) => {
      e.preventDefault();
      stakeEdcoin(state);
    },
    [stakeEdcoin, state]
  );
  return (
    <Container>
      <Row className="justify-content-md-center py-4 text-center">
        <b>Unstake Edcoin</b>
      </Row>
      <Row className="justify-content-md-center">
        <Col xs sm md={3}>
          <Form className="py-4 text-center">
            <Form.Group controlId="amount">
              <Form.Control
                onChange={(e) => setState(e.target.value)}
                type="number"
                placeholder="Amount of tokens to unstake"
              />
            </Form.Group>

            <Button onClick={handleUnStake} variant="primary" type="submit">
              Unstake
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
