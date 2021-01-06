import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

type Props = {
  balance: number;
};

export const Unstake = ({ balance }: Props) => {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setTotalBalance(balance);
  }, [balance]);

  const computeUnstakeAmount = useCallback((value: number) => {
    let amount: number = value * totalBalance;
    setTotalBalance(amount);
  }, []);

  const handleAmountChange = (amount: number) => {
    if (amount > balance) {
      setErrorMessage('Insufficient balance');
    }
  };

  return (
    <form>
      <FormControl id="amount">
        <Flex justifyContent="space-between">
          <FormLabel>Stake amount</FormLabel>
          <FormLabel color="grey" size="sm">
            Wallet Balance: {balance} EDC
          </FormLabel>
        </Flex>
        <Input
          type="number"
          id="amount"
          value={totalBalance}
          onChange={(e) => handleAmountChange(Number(e.target.value))}
        />
        <FormHelperText>Enter amount of EDC you wish to unstake</FormHelperText>
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
      <Button my={4} colorScheme="teal" size="md">
        Unstake
      </Button>
    </form>
  );
};
