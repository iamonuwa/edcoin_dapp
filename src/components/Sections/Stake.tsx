import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React, { Fragment, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import EdcoinStakingContract from 'services/stake';
import { toBN, toWei } from 'utils/convert';
import Edcoin from 'services/edcoin';

type Props = {
  balance: number | string;
  account: string | undefined | null;
};

const StakeModal = ({
  isOpen,
  onClose,
  amount,
  account,
  balance,
}: {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  account: string | undefined | null;
  balance: string | number;
}) => {
  const router = useRouter();
  const submitToBlockchain = async () => {
    const edcoinStakingContract = new EdcoinStakingContract();
    const edcoinContract = new Edcoin();
    const isRegistered = await edcoinStakingContract.checkIfRegistered(account);

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

    if (account) {
      if (isRegistered) {
        await edcoinStakingContract.stake(account, requestBN.toString());
        alert(
          'Stake request sent. Check your wallet to see when it has completed, then refresh this page.'
        );
      } else {
        await edcoinContract.approveToken(requestBN.toString(), account);
        await edcoinStakingContract.registerAndStake(
          account,
          requestBN.toString(),
          router.query.referrer as string
        );
        alert(
          'Stake request sent. Check your wallet to see when it has completed, then refresh this page.'
        );
      }
    }
    onClose();
  };
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Confirm stake</ModalHeader>
        <ModalBody>
          <Flex justify="space-between">
            <Text mb="1rem">You are about to stake</Text>
            <Text mb="1rem" fontWeight="bold">
              {amount} EDC
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => submitToBlockchain()} variant="ghost">
            Proceed
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const Stake = ({ balance, account }: Props) => {
  const [totalBalance, setTotalBalance] = useState<string>('0');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const computeSpendingAmount = useCallback((value: number) => {
    let amount: number = value * Number(balance);
    let calculatedAmount = parseFloat(amount.toFixed(4));
    setTotalBalance(calculatedAmount.toString());
  }, []);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let amount = Number(event.target.value);
    if (amount > balance) {
      setErrorMessage('Insufficient balance');
    } else {
      setTotalBalance(amount.toString());
    }
  };

  const handleStakeForm = useCallback(() => {
    setConfirmModal(true);
  }, []);

  return (
    <Fragment>
      <form>
        <FormControl id="email">
          <Flex justifyContent="space-between">
            <FormLabel>Stake amount</FormLabel>
            <Text color="grey" fontSize="sm">
              Wallet Balance: {balance} EDC
            </Text>
          </Flex>
          <Input
            value={totalBalance}
            type="number"
            onChange={(e) => handleAmountChange(e)}
          />
          <FormHelperText>Enter amount of EDC you wish to stake</FormHelperText>
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
              onClick={() => computeSpendingAmount(0.25)}
            >
              25%
            </Box>
            <Box
              borderRadius={30}
              py={2}
              px={4}
              bgColor="steelblue"
              cursor="pointer"
              onClick={() => computeSpendingAmount(0.5)}
            >
              50%
            </Box>
            <Box
              borderRadius={30}
              py={2}
              px={4}
              bgColor="steelblue"
              cursor="pointer"
              onClick={() => computeSpendingAmount(0.75)}
            >
              75%
            </Box>
            <Box
              borderRadius={30}
              py={2}
              px={4}
              bgColor="steelblue"
              cursor="pointer"
              onClick={() => computeSpendingAmount(1)}
            >
              100%
            </Box>
          </Flex>
        </Box>
        <Button
          disabled={!account}
          my={4}
          onClick={handleStakeForm}
          colorScheme="teal"
          size="md"
        >
          Stake
        </Button>
      </form>
      <StakeModal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        amount={totalBalance}
        account={account}
        balance={balance}
      />
    </Fragment>
  );
};
