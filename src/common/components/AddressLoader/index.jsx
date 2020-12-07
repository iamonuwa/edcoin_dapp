import React from 'react';
import { Container } from 'react-bootstrap';
import styles from './addressloader.module.scss';
import { Blockies } from '../Blockies';
import { shortenAddress } from '../../utils';

export const AddressLoader = ({ address }) => {
  return (
    <>
      <Container className={styles.address}>
        <Blockies className={styles.avatar} address={address} imageSize={30} />
        <small>{shortenAddress(address)}</small>
      </Container>
    </>
  );
};
