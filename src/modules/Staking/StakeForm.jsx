import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useContract } from '../../common/providers/Edcoin.provider';
export default function StakeForm() {
  const [state, setState] = React.useState(0);

  const [referralAddress, setReferralAddress] = React.useState(
    window.location.hash.substr(2)
  );
  React.useEffect(() => {
    if (!referralAddress || referralAddress.length !== 42)
      setReferralAddress('0x0000000000000000000000000000000000000000');
  }, []);

  const [, , stakeEdcoin] = useContract();

  const handleStake = React.useCallback(
    (e) => {
      e.preventDefault();
      stakeEdcoin(state, referralAddress);
    },
    [stakeEdcoin, state, referralAddress]
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

            <Button
              onClick={handleStake}
              variant="outline-primary"
              type="submit"
            >
              Stake
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
