import { useEffect, useState } from "react";
import {
  Flex,
  Button,
  Text,
  useToast,
  Image,
  Link,
  Box
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useEthers } from "@usedapp/core";
import ClaimImage from "./ClaimImage";
import { utils } from "ethers";
import {
  useDerivativeContractMethod, GetDerivativeBalance, GetDerivativesToClaim, IsPausedClaimingToy, IsPausedClaimingPainting, IsPausedClaimingStatteute
} from "../hooks";

export default function Claim() {

  const { account } = useEthers();
  const balance = GetDerivativeBalance(account);
  const toyBalance = GetDerivativesToClaim(account, 1);
  const paintingBalance = GetDerivativesToClaim(account, 2);
  const statteuteBalance = GetDerivativesToClaim(account, 3);
  const { state, send: claim } = useDerivativeContractMethod("claim");
  const isPausedClaimingToy = IsPausedClaimingToy();
  const isPausedClaimingPainting = IsPausedClaimingPainting();
  const isPausedClaimingStatteute = IsPausedClaimingStatteute();
  const toast = useToast();

  const [myBalance, setMyBalance] = useState(0);
  const [myToy, setMyToy] = useState(0);
  const [myPainting, setMyPainting] = useState(0);
  const [myStatteute, setMyStatteute] = useState(0);

  // const [myIsPausedClaimingToy, setMyIsPausedClaimingToy] = useState(false);
  // const [myIsPausedClaimingPainting, setMyIsPausedClaimingPainting] = useState(false);
  // const [myIsPausedClaimingStatteute, setMyIsPausedClaimingStatteute] = useState(false);

  useEffect(() => {
    setMyBalance(balance ? balance.toNumber() : 0);
  }, [balance]);

  // useEffect(() => {
  //   setMyIsPausedClaimingToy(isPausedClaimingToy ? isPausedClaimingToy.toNumber() : 0);
  // }, [isPausedClaimingToy]);

  useEffect(() => {
    setMyToy(toyBalance ? toyBalance.toNumber() : 0);
  }, [toyBalance]);

  useEffect(() => {
    setMyPainting(paintingBalance ? paintingBalance.toNumber() : 0);
  }, [paintingBalance]);

  useEffect(() => {
    setMyStatteute(statteuteBalance ? statteuteBalance.toNumber() : 0);
  }, [statteuteBalance]);

  async function handleClaim(category: any, count: any) {
    console.log(category);
    await claim(category, count, {
      value: utils.parseEther("0"),
    });
  }

  useEffect(() => {
    doPostTransaction(state);
  }, [state]);

  function doPostTransaction(state: any) {
    let msg = "";
    switch (state.status) {
      case "Success":
        msg = "Success. please wait";
        toast({
          description: msg,
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      break;
      case "None":
      break;
      case "Mining":
        msg = "Claiming now";
        toast({
          description: msg,
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      break;
      case "Fail":
        msg = "Claiming transaction failed";
        toast({
          description: msg,
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      break;
      case "Exception":
        msg = "Failed. Note: You need to be in the respective whitelists to be able to claim";
        toast({
          description: msg,
          status: "warning",
          duration: 5000,
          position: "top-right",
          isClosable: true,
        });
      break;
    }
  }

  return (
    <Flex direction="column" align="center" mt="4" margin="10px">
      <Flex direction={["column", "column", "row"]} align="center" mt="4" margin="10px">
        <Flex direction="column" align="center" mt="4" marginLeft="50px" marginRight="50px">
          <Image src="/toy.png" alt="toy image" width="200px" height="200px" marginBottom="5px" />
          {isPausedClaimingToy ? (
            <Text color="red" fontSize="2xl" marginTop="2px">
              Toy claiming is: Paused
            </Text>
          ): (
            <Text color="#03f303" fontSize="2xl" marginTop="2px">
              Toy claiming is: Live
            </Text>
          )}          
          <Button style={{backgroundColor:"#04ff00"}} size="lg" marginTop="5" marginBottom="5" onClick={() => handleClaim(1, myToy)} disabled={account ? (myToy > 0 ? (!isPausedClaimingToy ? false : true) : true) : true} width="100%">
            Claim {myToy} toy
          </Button>
          <Link href="https://opensea.io/collection/mypfpland" isExternal color="#ece70a" style={{boxShadow: "none"}}>
            View on OpenSea <ExternalLinkIcon mx="2px" />
          </Link>
        </Flex>
        <Flex direction="column" align="center" mt="4" marginLeft="50px" marginRight="50px">
          <Image src="/painting.png" alt="painting image" width="200px" height="200px" marginBottom="5px"/>
          {isPausedClaimingPainting ? (
            <Text color="red" fontSize="2xl" marginTop="2px" textAlign="center">
              Painting claiming is: Paused
            </Text>
          ): (
            <Text color="#03f303" fontSize="2xl" marginTop="2px" textAlign="center">
              Honorary claiming is: Live
            </Text>
          )}
          <Button style={{backgroundColor:"#04ff00"}} size="lg" marginTop="5" marginBottom="5" onClick={() => handleClaim(2, myPainting)} disabled={account ? (myPainting > 0 ? (!isPausedClaimingPainting ? false : true) : true) : true} width="100%">
            Claim {myPainting} Honorary
          </Button>
          <Link href="https://opensea.io/collection/mypfpland" isExternal color="#ece70a" style={{boxShadow: "none"}}>
            View on OpenSea <ExternalLinkIcon mx="2px" />
          </Link>
        </Flex>
        <Flex direction="column" align="center" mt="4" marginLeft="50px" marginRight="50px">
        <Image src="/statteute.png" alt="statteute image" width="200px" height="200px" marginBottom="5px"/>
          {isPausedClaimingStatteute ? (
            <Text color="red" fontSize="2xl" marginTop="2px" textAlign="center">
              Statuette claiming is: Paused
            </Text>
          ): (
            <Text color="#03f303" fontSize="2xl" marginTop="2px" textAlign="center">
              Zen Elf claiming is: Live
            </Text>
          )}
          <Button style={{backgroundColor:"#04ff00"}} size="lg" marginTop="5" marginBottom="5" onClick={() => handleClaim(3, myStatteute)} disabled={account ? (myStatteute > 0 ? (!isPausedClaimingStatteute ? false : true) : true) : true} width="100%">
            Claim {myStatteute} Zen Elf
          </Button>
          <Link href="https://opensea.io/collection/mypfpland" isExternal color="#ece70a" style={{boxShadow: "none"}}>
            View on OpenSea <ExternalLinkIcon mx="2px" />
          </Link>
        </Flex>        
      </Flex>
      <Text color="#666666" fontSize="2xl" marginTop="5px" textAlign="center">
        You need to be in the respective whitelists to be able to claim
      </Text>
      <Text color="white" fontSize="4xl" marginTop="5px" textAlign="center">
        You claimed {myBalance} derivatives.
      </Text>
      <Box
        overflowX="auto"
        d="flex"
        maxW="100vw"
        h="100%"
        whiteSpace="nowrap"
        pb="4px"
        px="5px"
        css={{
          '&::-webkit-scrollbar': {
            width: '1px',
          },
          '&::-webkit-scrollbar-track': {
            width: '1px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#707070',
            borderRadius: '5px',
          },
        }}
      >
        {Array.from(Array(myBalance).keys()).map((index) => {
          return <ClaimImage account={account} index={index} key={index}/>
        })}
      </Box>
    </Flex>
  );
}
