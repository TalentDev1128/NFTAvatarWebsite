import { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Text,
  Button,
  useToast,
  RadioGroup,
  Radio,
  Stack
} from "@chakra-ui/react";
import NFTImage from "./NFTImage"
import { utils } from "ethers";
import { useEthers } from "@usedapp/core";
import ReactLoading from 'react-loading';
import {
  GetTotalSupply,
  GetBalance,
  GetBloot,
  useContractMethod
} from "../hooks";

import { sendMetaDataRequest, sendDeleteRequest, getCurrentState, getMetaData } from "../services/Metadata";

export default function Mint() {

  const { account } = useEthers();
  const balance = GetBalance(account);
  const bloot = GetBloot(account);
  const totalSupply = GetTotalSupply();
  const { state, send: safeMint } = useContractMethod("requestNewBloot");
  const [myBalance, setMyBalance] = useState(0);
  const [myBloot, setMyBloot] = useState(0);
  const [donateType, setDonateType] = useState("1");
  const [showLoading, setShowLoading] = useState(false);
  // const [currentTotalMint, setCurrentTotalMint] = useState("0/5000");
  const [currentHonorary, setCurrentHonorary] = useState("0/100");
  const toast = useToast();
  const divStyle = {
    display: 'none'
  };

  const intervalId = setInterval(async () => {
    // api call to collect totalMint and honoraryElves
    const { totalMint, honoraryElves } = await getCurrentState();
    // setCurrentTotalMint(totalMint);
    setCurrentHonorary(honoraryElves);
  }, 10000);

  useEffect(() => {
    setMyBalance(balance ? balance.toNumber() : 0);
  }, [balance]);

  useEffect(() => {
    setMyBloot(bloot ? bloot.toNumber() : 0);
  }, [bloot]);

  useEffect(() => {
    doPostTransaction(state);
    if (state.status === "Fail" || state.status === "Exception")
      sendDeleteRequest(account, donateType);
  }, [state]);

  async function handleMint() {
    // const metadata = await getMetaData();
    setShowLoading(true);
    const { metadata, allowed, tokenId } = await sendMetaDataRequest(donateType, account);
    console.log(tokenId);
    setShowLoading(false);
    if (!allowed) {
      toast({
        description: "Try another donation. 100 people already did this",
        status: "warning",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    let donateValue = "";
    if (donateType === "2")
      donateValue = "0.01";
    if (donateType === "3")
      donateValue = "0.04";
    if (donateType === "4")
      donateValue = "0.5";

    if (donateType !== "1") {
      await safeMint(tokenId, metadata, {
        value: utils.parseEther(donateValue),
      });
    } else {
      await safeMint(tokenId, metadata);
    }
  }

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
        msg = "Minting now";
        toast({
          description: msg,
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      break;
      case "Fail":
        msg = "Minting transaction failed";
        toast({
          description: msg,
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      break;
      case "Exception":
        msg = "Mint failed, please try again. Note: You need at least one Bloot. Each Bloot can mint no more than 2x Bloot Elves.";
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
      {account ? (
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
            return <NFTImage account={account} index={index}/>
          })}
        </Box>
        ) : (
          <Text></Text>
        )
      }
      <Text color="white" fontSize="4xl">
        {account ? (myBalance ? '' : 'You own ' + myBloot + ' Bloots. You can mint ' + (myBloot * 2) + ' Elves') : 'Please connect your wallet'}
      </Text>
      {account ? (myBalance ? (
        <Text color="white" fontSize="2xl" marginTop="5px">
        You own {myBloot} Bloots. You can mint {myBloot * 2} Elves
        </Text>
        ) : '') : ''}
      <Button colorScheme="teal" size="lg" marginTop="5" onClick={handleMint} disabled={account ? false : true} width="35%" height={account ? (myBalance ? 20 : 25): 20}>
        Mint New Elf
      </Button>
      <Text color="white" fontSize="2xl" marginTop="2px">
        {totalSupply ? totalSupply.toNumber() : 0}/5000
      </Text>
      <RadioGroup color="white" marginTop="10" marginBottom="50" defaultValue="1" value={donateType} onChange={setDonateType}>
        <Stack spacing={5} direction="column">
          <Radio value="1">
            Free Mint
          </Radio>
          <Radio value="2">Donate 0.01eth for 50% chance of rarer traits</Radio>
          <Radio value="3">Donate 0.04eth for cameo of your Elves in future content</Radio>
          <Radio value="4">Donate 0.5eth for status of Honorary Elf ({currentHonorary})</Radio>
        </Stack>
      </RadioGroup>
      <div style={showLoading? undefined: divStyle}>
        <ReactLoading type="spinningBubbles" color="#ffffff" height={80} width={80} />
      </div>
    </Flex>
  );
}
