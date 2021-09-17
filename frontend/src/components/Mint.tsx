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
  useContractMethod
} from "../hooks";

import { sendMetaDataRequest, sendDeleteRequest, getMetaData } from "../services/Metadata";

export default function Mint() {

  const { account } = useEthers();
  const balance = GetBalance(account);
  const totalSupply = GetTotalSupply();
  const { state, send: safeMint } = useContractMethod("requestNewBloot");
  const [myBalance, setMyBalance] = useState(0);
  const [donateType, setDonateType] = useState("1");
  const [showLoading, setShowLoading] = useState(false);
  const toast = useToast();
  const divStyle = {
    display: 'none'
  };

  useEffect(() => {
    setMyBalance(balance ? balance.toNumber() : 0);
  }, [balance]);

  useEffect(() => {
    doPostTransaction(state);
    if (state.status === "Fail" || state.status === "Exception")
      sendDeleteRequest(account, donateType);
  }, [state]);

  async function handleMint() {
    // const metadata = await getMetaData();
    setShowLoading(true);
    const { metadata, allowed } = await sendMetaDataRequest(donateType, account);
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
      await safeMint(totalSupply, metadata, {
        value: utils.parseEther(donateValue),
      });
    } else {
      await safeMint(totalSupply, metadata);
    }
  }

  function doPostTransaction(state: any) {
    let msg = "";
    switch (state.status) {
      case "Success":
        msg = "A new bloot was minted successfully";
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
        msg = "Sorry, you encountered exception.\nPlease check your Bloots.\nYou need at least one Bloot and also can have no more than two times BlootElves of Bloot";
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
    <Flex direction="column" align="center" mt="4">
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
        {account ? (myBalance ? '' : 'Not found your NFT') : 'Please connect your wallet'}
      </Text>
      <Button colorScheme="teal" size="lg" marginTop="5" onClick={handleMint} disabled={account ? false : true} width="25%" height={32}>
        Mint Avatar
      </Button>
      <RadioGroup color="white" marginTop="10" marginBottom="50" defaultValue="1" value={donateType} onChange={setDonateType}>
        <Stack spacing={10} direction="row">
          <Radio value="1">
            Just Mint
          </Radio>
          <Radio value="2">Donate 0.01eth</Radio>
          <Radio value="3">Donate 0.04eth</Radio>
          <Radio value="4">Donate 0.5eth</Radio>
        </Stack>
      </RadioGroup>
      <div style={showLoading? undefined: divStyle}>
        <ReactLoading type="spinningBubbles" color="#ffffff" height={80} width={80} />
      </div>
    </Flex>
  );
}
