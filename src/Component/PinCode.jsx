import React, { useState } from 'react';
import axios from 'axios';
import 'animate.css';
import {
  Container,
  SimpleGrid,
  Flex,
  Text,
  Stack,
  StackDivider,
  Input,
  Button,
  useColorModeValue,
  Alert,
  AlertIcon,
  Box,
} from '@chakra-ui/react';

const Feature = ({ text, text_label }) => {
  return (
    <Stack direction={'row'} align={'center'}>
      <Text fontSize={'sm'} fontWeight={600}>{text_label} : </Text>
      <Text fontSize={'lg'} fontWeight={800}>{text}</Text>
    </Stack>
  );
};

const validatePinCode = (code) => {
  const regex = /^[0-9]{6}$/;
  return regex.test(code);
};

export default function PinCode() {
  const [pinCode, setPinCode] = useState('');
  const [isValidPin, setIsValidPin] = useState(true);
  const [pinCodeDetails, setPinCodeDetails] = useState(null);
  const [error, setError] = useState(null);

  const handlePinChange = (e) => {
    setPinCode(e.target.value);
    setIsValidPin(true);
    setError(null);
  };

  const fetchPinCodeDetails = async () => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pinCode}`);
      console.log(response.data)
      setPinCodeDetails(response.data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setPinCodeDetails(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatePinCode(pinCode)) {
      fetchPinCodeDetails();
    } else {
      setIsValidPin(false);
      setPinCodeDetails(null);
    }
  };

  return (
    <Container maxW={'5xl'} py={12}>
      <Text
        textTransform={'uppercase'}
        color={'blue.400'}
        fontWeight={600}
        fontSize={'sm'}
        textAlign={'center'}
        bg={useColorModeValue('blue.50', 'blue.900')}
        p={5}
        alignSelf={'flex-start'}
        rounded={'md'}>
        Pin Code Details Finder
      </Text>
      <SimpleGrid columns={{ base: 1, md: 1 }} mt={10} spacing={10}>
        <Flex textAlign={'center'} ml={'auto'} mr={'auto'}>
          <form onSubmit={handleSubmit}>
            <Text as={'b'} fontSize='lg'>Enter Pin Code</Text>
            <Input
              type="text"
              placeholder={'Enter Pin code here..'}
              size={'lg'}
              value={pinCode}
              onChange={handlePinChange}
            />
            
            {!isValidPin && <Text color="red.500">Invalid Pin code format. Please enter a valid Pin code.</Text>}
            <Button mt={3} colorScheme='teal' size='lg' type="submit">Fetch Details</Button>
          </form>
        </Flex>
        <Stack spacing={4}>
          {pinCodeDetails && !error && (
            <>
              <Alert status="info">
                <AlertIcon />
                {pinCodeDetails[0].Message}
              </Alert>
              <Stack spacing={4} divider={<StackDivider  />}>
                {pinCodeDetails[0].PostOffice && pinCodeDetails[0].PostOffice.map((postOffice, index) => (
                  <Box key={index}>
                    <Feature text={postOffice.Name} text_label={'Post Office Name'} />
                    <Feature text={postOffice.BranchType} text_label={'Branch Type'} />
                    <Feature text={postOffice.DeliveryStatus} text_label={'Delivery Status'} />
                    <Feature text={postOffice.Circle} text_label={'Circle'} />
                    <Feature text={postOffice.District} text_label={'District'} />
                    <Feature text={postOffice.Division} text_label={'Division'} />
                    <Feature text={postOffice.Region} text_label={'Region'} />
                    <Feature text={postOffice.Block} text_label={'Block'} />
                    <Feature text={postOffice.State} text_label={'State'} />
                    <Feature text={postOffice.Country} text_label={'Country'} />
                    <Feature text={postOffice.Pincode} text_label={'Pincode'} />
                  </Box>
                ))}
              </Stack>
            </>
          )}
          {error && <Text color="red.500">Error: {error}</Text>}
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
