import React, { useEffect } from 'react';
import { Link, NavLink, Route, Switch } from 'react-router-dom';

import Staking from './Staking';

import styles from '../common/styles/layout.module.scss';
import { Button } from '../common/components/Button';
import { AddressLoader } from '../common/components/AddressLoader';

import { useWeb3 } from '../common/providers/Web3.provider';
import { useContract } from '../common/providers/Edcoin.provider';

export default function Layout() {
  const [userState, login] = useWeb3();
  const [, loadContract] = useContract();

  useEffect(() => {
    loadContract();
  }, [loadContract]);

  const handleWeb3Login = React.useCallback(() => {
    login();
  }, [login]);
  return (
    <React.Fragment>
      <div className={styles.container}>
        <header className={styles.container__header}>
          <Link to="/">
            <div className={styles.logo}>logo</div>
          </Link>
          <div className={styles.toolbar}>
            {userState.address ? (
              <AddressLoader address={userState.address} />
            ) : (
              <Button
                classNames={[styles.button, styles.button_primary].join(' ')}
                text="Connect Web3"
                onClick={handleWeb3Login}
              />
            )}
          </div>
        </header>
        <main className={styles.container__main}>
          <Switch>
            <Route path="/" component={Staking} />
          </Switch>
        </main>
      </div>
    </React.Fragment>
  );
}
