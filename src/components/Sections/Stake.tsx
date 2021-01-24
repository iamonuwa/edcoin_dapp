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
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
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
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitToBlockchain = async () => {
    const edcoinStakingContract = new EdcoinStakingContract();
    const edcoinContract = new Edcoin();
    const isRegistered = await edcoinStakingContract.checkIfRegistered(account);
    setIsLoading(true);
    const min = 1;
    const requestBN = toBN(toWei(amount.toString() || '0'));
    try {
      if (requestBN.lt(toBN(toWei(min.toString())))) {
        toast({
          title: 'Insufficient EDC balance',
          description:
            'Must send at least ' +
            min.toString() +
            ' Edcoin to stake and register.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      if (requestBN.gt(toBN(toWei(balance.toString())))) {
        toast({
          title: 'Insufficient EDC balance',
          description: 'Cannot stake more Edcoin than is in your account.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      if (account) {
        console.log('isRegistered ', isRegistered);

        if (isRegistered) {
          await edcoinContract.approveToken(requestBN.toString(), account);
          await edcoinStakingContract.stake(account, requestBN.toString());
          toast({
            title: 'Stake request sent',
            description:
              'Check your wallet to see when it has completed, then refresh this page.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        } else {
          await edcoinContract.approveToken(requestBN.toString(), account);
          await edcoinStakingContract.registerAndStake(
            account,
            requestBN.toString(),
            router.query.referrer as string
          );
          toast({
            title: 'Stake request sent',
            description:
              'Check your wallet to see when it has completed, then refresh this page.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }
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

export const Stake = ({ balance, account }: Props) => {
  const { errors, handleSubmit, control } = useForm({
    mode: 'all',
  });

  const [totalBalance, setTotalBalance] = useState<string>('0.00');
  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const onStakeSubmit = async (data: any) => {
    setTotalBalance(data.stake);
    if (Number(data.stake) > 0) {
      setConfirmModal(true);
    }
  };

  const checkBalance = (value: string) => {
    if (Number(value) <= balance) {
      return true;
    } else {
      return 'Stake amount cannot exceed current EDC balance';
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onStakeSubmit)}>
        <FormControl id="stake" isInvalid={errors.stake}>
          <Flex justifyContent="space-between">
            <FormLabel>Stake amount</FormLabel>
            <Text color="grey" fontSize="sm">
              Wallet Balance: {balance} EDC
            </Text>
          </Flex>
          <Controller
            control={control}
            name="stake"
            defaultValue={balance}
            rules={{
              validate: checkBalance,
              required: { value: true, message: 'Stake amount is required' },
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
            {errors.stake && errors.stake.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          disabled={!account || errors.stake}
          my={4}
          type="submit"
          variant="outline"
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
