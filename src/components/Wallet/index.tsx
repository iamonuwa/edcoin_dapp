import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  Flex,
  Link,
  useClipboard,
  Button,
} from '@chakra-ui/react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { shortenAddress } from 'utils';
import { SUPPORTED_WALLETS } from 'constant';
import { isMobile } from 'react-device-detect';
import { Option } from 'components/Wallet/Option';
import { injected } from 'connectors';
import { Pending } from 'components/Wallet/Pending';
import usePrevious from 'hooks/usePrevious';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  state: string;
};

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
};

export const WalletModal = ({ isOpen, onClose }: Props) => {
  const { onCopy } = useClipboard('');
  const { account, connector, activate, error, active } = useWeb3React();
  const [walletView, setWalletView] = useState<string>(WALLET_VIEWS.ACCOUNT);
  const [pendingWallet, setPendingWallet] = useState<
    AbstractConnector | undefined
  >();
  const [pendingError, setPendingError] = useState<boolean>();

  const previousAccount = usePrevious(account);

  useEffect(() => {
    if (account && !previousAccount && isOpen) {
      onClose();
    }
  }, [account, previousAccount, onClose, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setPendingError(false);
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [isOpen]);

  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);

  useEffect(() => {
    if (
      isOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [
    setWalletView,
    isOpen,
    active,
    error,
    connector,
    activePrevious,
    connectorPrevious,
  ]);

  const handleWalletChange = useCallback(() => {
    setWalletView(WALLET_VIEWS.OPTIONS);
  }, []);

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return SUPPORTED_WALLETS[key].name;
      }
      return true;
    });
    setPendingWallet(connector); // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING);

    connector &&
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector); // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true);
        }
      });
  };

  const getOptions = () => {
    let isMetamask: boolean = false;
    if (typeof window !== 'undefined') {
      // @ts-ignore
      isMetamask = 'ethereum' in window && window.ethereum.isMetaMask;
    }

    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key];
      if (isMobile) {
        if (typeof window !== 'undefined') {
          // @ts-ignore
          if (!window.web3 && !window.ethereum && option.mobile) {
            return (
              <Option
                onClick={() => {
                  option.connector !== connector &&
                    !option.href &&
                    tryActivation(option.connector);
                }}
                id={`connect-${key}`}
                key={key}
                active={option.connector && option.connector === connector}
                color={option.color}
                link={option.href}
                header={option.name}
                subheader={null}
              />
            );
          }
          return null;
        }
      }
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (typeof window !== 'undefined') {
          // @ts-ignore
          if (!(window.web3 || window.ethereum)) {
            if (option.name === 'MetaMask') {
              return (
                <Option
                  id={`connect-${key}`}
                  key={key}
                  color={'#E8831D'}
                  header={'Install Metamask'}
                  subheader={null}
                  link={'https://metamask.io/'}
                  // icon={require('../../assets/images/' + option.iconName)}
                />
              );
            } else {
              return null; //dont want to return install twice
            }
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null;
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null;
        }
      }
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector);
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            // icon={require('../../assets/images/' + option.iconName)}
          />
        )
      );
    });
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      {walletView === WALLET_VIEWS.ACCOUNT && account ? (
        <ModalContent>
          <ModalHeader>Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box px={1} py={5} rounded={5} borderWidth={1}>
              <Box px={3}>
                <Flex justify="space-between">
                  <Flex direction="column">
                    <Text colorScheme="gray.100" size="sm">
                      Connected with Metamask
                    </Text>
                    {account && (
                      <Text fontSize="2xl" fontWeight={600}>
                        {shortenAddress(account)}
                      </Text>
                    )}
                    <Flex pt={5} justify="flex-start">
                      <Text
                        onClick={onCopy}
                        cursor="pointer"
                        fontSize="sm"
                        mr={[0, 0, 0, 3]}
                      >
                        Copy Address
                      </Text>
                      <Link
                        isExternal
                        href={`https://etherscan.io/address/${account}`}
                        fontSize="sm"
                        _hover={{
                          textDecoration: 'none',
                        }}
                      >
                        View on Etherscan
                      </Link>
                    </Flex>
                  </Flex>
                  <Button
                    onClick={handleWalletChange}
                    size="xs"
                    outline="none"
                    variant="outline"
                  >
                    Change
                  </Button>
                </Flex>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      ) : error ? (
        <ModalContent>
          <ModalHeader>
            {error instanceof UnsupportedChainIdError
              ? 'Wrong Network'
              : 'Error connecting'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {error instanceof UnsupportedChainIdError ? (
              <Text>
                App is running on Rinkeby. Please update your network
                configuration.
              </Text>
            ) : (
              'Error connecting. Try refreshing the page.'
            )}
          </ModalBody>
        </ModalContent>
      ) : (
        <ModalContent>
          <ModalHeader>Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {walletView === WALLET_VIEWS.PENDING ? (
              <Pending
                connector={pendingWallet}
                error={pendingError}
                setPendingError={setPendingError}
                tryActivation={tryActivation}
              />
            ) : (
              <>{getOptions()}</>
            )}
            {walletView !== WALLET_VIEWS.PENDING && (
              <Text pt={3} fontSize="sm">
                New to Ethereum?{' '}
                <Link isExternal href="https://ethereum.org/wallets/">
                  Learn more about wallets
                </Link>
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
};
