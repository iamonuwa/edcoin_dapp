import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useContract } from '../../common/providers/Edcoin.provider';
export default function StakeForm() {
  const [state, setState] = React.useState(0);

  const [, , stakeEdcoin] = useContract();

  const handleStake = React.useCallback(
    (e) => {
      e.preventDefault();
      stakeEdcoin(state);
    },
    [stakeEdcoin, state]
  );
  return (
    <Container>
      <Row className="justify-content-md-center py-4 text-center">
        <b>Stake Edcoin</b>
      </Row>
      <Row className="justify-content-md-center">
        <Col xs sm md={3}>
          <Form className="py-4 text-center">
            <Form.Group controlId="amount">
              <Form.Control
                onChange={(e) => setState(e.target.value)}
                type="number"
                placeholder="Enter amount of tokens"
              />
            </Form.Group>

            <Button onClick={handleStake} variant="primary" type="submit">
              Stake
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
