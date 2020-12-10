import React from 'react';
import { Card, Container, Row, Col, Tabs, Tab } from 'react-bootstrap';

import StakeForm from './StakeForm';
import UnStakeForm from './UnStakeForm';
import Reward from './Reward';
import Referral from './Referral';
import { useContract } from '../../common/providers/Edcoin.provider';

import { toEther, toBN, formatNumber } from '../../common/utils';

export default function Staking() {
  const [contractState] = useContract();
  return (
    <React.Fragment>
      <Container className="py-5">
        <Row>
          <Col xs={12} sm={12} md={3} lg={3}>
            <Card>
              <Card.Body>
                <b>
                  {formatNumber.format(
                    toEther(toBN(contractState.totalEdcoin))
                  )}
                </b>
              </Card.Body>
              <Card.Footer>Total Edcoin</Card.Footer>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={3} lg={3}>
            <Card>
              <Card.Body>
                <b>
                  {formatNumber.format(
                    toEther(toBN(contractState.totalStaked))
                  )}
                </b>
              </Card.Body>
              <Card.Footer>Total Edcoin Staked</Card.Footer>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={3} lg={3}>
            <Card>
              <Card.Body>
                <b>
                  {formatNumber.format(
                    toEther(toBN(contractState.accountEdcoinStaked))
                  )}
                </b>
              </Card.Body>
              <Card.Footer>Your Staked Edcoin</Card.Footer>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={3} lg={3}>
            <Card>
              <Card.Body>
                <b>
                  {formatNumber.format(
                    toEther(toBN(contractState.accountBalance))
                  )}
                </b>
              </Card.Body>
              <Card.Footer>Your Edcoin Balance</Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
      <Container className="py-3">
        <Tabs fill defaultActiveKey="stake" id="uncontrolled-tab-example">
          <Tab eventKey="stake" title="Stake">
            <StakeForm />
          </Tab>
          <Tab eventKey="unstake" title="Unstake">
            <UnStakeForm />
          </Tab>
          <Tab eventKey="rewards" title="Rewards">
            <Reward />
          </Tab>
          <Tab eventKey="referrals" title="Referrals">
            <Referral />
          </Tab>
        </Tabs>
      </Container>
    </React.Fragment>
  );
}
