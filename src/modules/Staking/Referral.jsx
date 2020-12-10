import React from 'react';
import {
  Container,
  Button,
  Row,
  Col,
  InputGroup,
  FormControl,
  Card,
  Form,
} from 'react-bootstrap';
import { useWeb3 } from '../../common/providers/Web3.provider';
import { useContract } from '../../common/providers/Edcoin.provider';
import { toBN, toWei } from '../../common/utils';
import useCopyClipboard from '../../common/hooks/useCopy';

export default function Referral() {
  const [web3State] = useWeb3();
  const [contractState] = useContract();
  const siteUrl = window.location.origin;
  const [isCopied, setCopied] = useCopyClipboard();

  const referralCode = `${siteUrl}?addr=${web3State.address}`;

  const referralEarnings = toBN(contractState.referralCount)
    .mul(toBN(toWei('200')))
    .toString();

  return (
    <Container>
      <Row className="justify-content-md-center py-4 text-center">
        <Col xs sm md={6}>
          <Card>
            <Card.Body>{contractState.referralCount}</Card.Body>
            <Card.Footer>Total Referrals</Card.Footer>
          </Card>
        </Col>
        <Col xs sm md={6}>
          <Card>
            <Card.Body>{referralEarnings}</Card.Body>
            <Card.Footer>Total Earned</Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-md-center py-4">
        <Col>
          <Form.Label>Your referral code</Form.Label>
          <InputGroup className="mb-3">
            <FormControl
              disabled
              value={referralCode}
              placeholder="Recipient's username"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <Button
                variant="outline-primary"
                onClick={() => setCopied(referralCode)}
              >
                {isCopied ? 'Copied' : 'Copy'}
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );
}
