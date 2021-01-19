import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { Fragment, useCallback, useState } from 'react';
import EdcoinStakingContract from 'services/stake';
import { toBN, toWei } from 'utils/convert';

type Props = {
  balance: number | string;
  account: string | null | undefined;
};
const UnstakeModal = ({
  isOpen,
  onClose,
  amount,
  account,
  balance,
}: {
  isOpen: boolean;
  onClose: () => void;
  amount: string | number;
  account: string | undefined | null;
  balance: string | number;
}) => {
  const submitToBlockchain = async () => {
    const edcoinStakingContract = new EdcoinStakingContract();

    const min = 1;
    const requestBN = toBN(toWei(amount.toString() || '0'));
    if (requestBN.lt(toBN(toWei(min.toString())))) {
      alert(
        'Must send at least ' +
          min.toString() +
          ' Edcoin to stake and register.'
      );
      return;
    }
    if (requestBN.gt(toBN(toWei(balance.toString())))) {
      alert('Cannot stake more Edcoin than is in your account.');
      return;
    }

    console.log('Account ', account);

    if (account) {
      console.log('Stake submitToBlockchain...');
      await edcoinStakingContract.unstake(account, requestBN.toString());
      // alert(
      //   'Stake request sent. Check your wallet to see when it has completed, then refresh this page.'
      // );
      onClose();
    }
  };
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Confirm unstake</ModalHeader>
        <ModalBody>
          <Flex justify="space-between">
            <Text mb="1rem">You are about to unstake</Text>
            <Text mb="1rem" fontWeight="bold">
              {amount} EDC
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => submitToBlockchain()} variant="ghost">
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const Unstake = ({ balance, account }: Props) => {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const computeUnstakeAmount = useCallback((value: number) => {
    let amount: number = value * totalBalance;
    setTotalBalance(amount);
  }, []);

  const handleAmountChange = (amount: number) => {
    if (amount > balance) {
      setErrorMessage('Insufficient balance');
    } else {
      setTotalBalance(amount);
    }
  };

  const handleUnstakeForm = useCallback(() => {
    setConfirmModal(true);
  }, []);

  return (
    <Fragment>
      <form>
        <FormControl id="amount">
          <Flex justifyContent="space-between">
            <FormLabel>Stake amount</FormLabel>
            <Text color="grey" fontSize="sm">
              Wallet Balance: {balance} EDC
            </Text>
          </Flex>
          <Input
            type="number"
            id="amount"
            value={totalBalance}
            onChange={(e) => handleAmountChange(Number(e.target.value))}
          />
          <FormHelperText>
            Enter amount of EDC you wish to unstake
          </FormHelperText>
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </FormControl>

        <Box my={4}>
          <Flex>
            <Box
              borderRadius={30}
              py={2}
              px={4}
              bgColor="steelblue"
              cursor="pointer"
              onClick={() => computeUnstakeAmount(0.25)}
            >
              25%
            </Box>
            <Box
              borderRadius={30}
              py={2}
              px={4}
              bgColor="steelblue"
              cursor="pointer"
              onClick={() => computeUnstakeAmount(0.5)}
            >
              50%
            </Box>
            <Box
              borderRadius={30}
              py={2}
              px={4}
              bgColor="steelblue"
              cursor="pointer"
              onClick={() => computeUnstakeAmount(0.75)}
            >
              75%
            </Box>
            <Box
              borderRadius={30}
              py={2}
              px={4}
              bgColor="steelblue"
              cursor="pointer"
              onClick={() => computeUnstakeAmount(1)}
            >
              100%
            </Box>
          </Flex>
        </Box>
        <Button my={4} onClick={handleUnstakeForm} colorScheme="teal" size="md">
          Unstake
        </Button>
      </form>
      <UnstakeModal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        amount={totalBalance}
        account={account}
        balance={balance}
      />
    </Fragment>
  );
};
