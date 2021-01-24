import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { Fragment, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import EdcoinStakingContract from 'services/stake';
import { toBN, toWei } from 'utils/convert';

type Props = {
  balance: number | string;
  account: string | undefined | null;
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
  amount: string;
  account: string | undefined | null;
  balance: string | number;
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitToBlockchain = async () => {
    const edcoinStakingContract = new EdcoinStakingContract();
    setIsLoading(true);
    const requestBN = toBN(toWei(amount.toString() || '0'));
    try {
      if (requestBN.gt(toBN(toWei(balance.toString())))) {
        toast({
          title: 'Insufficient Staked EDC balance',
          description: 'Cannot unstake more Edcoin than is in your account.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      if (account) {
        await edcoinStakingContract.unstake(account, requestBN.toString());
        toast({
          title: 'Unstake request sent',
          description:
            'Check your wallet to see when it has completed, then refresh this page.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        setIsLoading(false);
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Wallet error',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setIsLoading(false);
      onClose();
    }
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
          <Button
            isLoading={isLoading}
            onClick={() => submitToBlockchain()}
            variant="ghost"
          >
            Proceed
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const Unstake = ({ balance, account }: Props) => {
  const { errors, handleSubmit, control } = useForm({
    mode: 'all',
  });

  const [totalBalance, setTotalBalance] = useState<string>('0.00');

  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const onUnstakeSubmit = async (data: any) => {
    setTotalBalance(data.unstake);
    if (Number(data.unstake) > 0) {
      setConfirmModal(true);
    }
  };

  const checkBalance = (value: string) => {
    if (Number(value) <= balance) {
      return true;
    } else {
      return 'Unstake amount cannot exceed current EDC balance';
    }
  };

  console.log('Current balance ', balance);
  return (
    <Fragment>
      <form onSubmit={handleSubmit(onUnstakeSubmit)}>
        <FormControl id="unstake" isInvalid={errors.unstake}>
          <Flex justifyContent="space-between">
            <FormLabel>Unstake amount</FormLabel>
            <Text color="grey" fontSize="sm">
              Staked balance: {balance} EDC
            </Text>
          </Flex>
          <Controller
            control={control}
            name="unstake"
            rules={{
              validate: checkBalance,
              required: { value: true, message: 'Unstake amount is required' },
            }}
            render={({ onChange, onBlur, value, name, ref }) => (
              <NumberInput
                name={name}
                ref={ref}
                onBlur={onBlur}
                variant="outline"
                value={value}
                onChange={onChange}
                placeholder="Enter amount of EDC you wish to stake"
              >
                <NumberInputField />
              </NumberInput>
            )}
          />
          <FormErrorMessage>
            {errors.unstake && errors.unstake.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          disabled={!account || errors.unstake}
          my={4}
          type="submit"
          colorScheme="teal"
          size="md"
        >
          Unstake EDC
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
