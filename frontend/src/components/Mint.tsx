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
import {
  GetTotalSupply,
  GetOldTotalSupply,
  GetBalance,
  GetCurrentFreeMint,
  GetCurrentDonated001,
  GetCurrentDonated004,
  GetCurrentHonorary,
  IsPausedMint,
  GetBloot,
  useContractMethod,
  GetTotalMigrate,
} from "../hooks";
import { simpleContractAddressOld } from "../contracts";

export default function Mint() {

  const { account } = useEthers();
  const balance = GetBalance(account);
  const bloot = GetBloot(account);
  const totalSupply = GetTotalSupply();
  const totalMigrated = GetTotalMigrate(simpleContractAddressOld);
  const oldTotalSupply = GetOldTotalSupply();
  const currentFreeMint = GetCurrentFreeMint();
  const currentDonated001 = GetCurrentDonated001();
  const currentDonated004 = GetCurrentDonated004();
  const currentHonorary = GetCurrentHonorary();
  const isPaused = IsPausedMint();
  const { state, send: safeMint } = useContractMethod("requestNewBloot");
  const [myTotalSupply, setMyTotalSupply] = useState(0);
  const [myOldTotalSupply, setMyOldTotalSupply] = useState(0);
  const [myBalance, setMyBalance] = useState(0);
  const [myBloot, setMyBloot] = useState(0);
  const [myCurrentFreeMint, setMyCurrentFreeMint] = useState(0);
  const [myCurrentDonated001, setMyCurrentDonated001] = useState(0);
  const [myCurrentDonated004, setMyCurrentDonated004] = useState(0);
  const [myCurrentHonorary, setMyCurrentHonorary] = useState(0);
  const [myMintPaused, setMyMintPaused] = useState(false);
  const [donateType, setDonateType] = useState("1");
  const [mytotalMigrated, setMyTotalMigrated] = useState(0);
  const originalFreeMint = 803;
  const originalDonated001 = 492;
  const originalDonated004 = 127;
  const originalHonorary = 62;
  // const [showLoading, setShowLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setMyBalance(balance ? balance.toNumber() : 0);
  }, [balance]);

  useEffect(() => {
    setMyMintPaused(isPaused ? isPaused : false);
  }, [isPaused]);

  useEffect(() => {
    setMyTotalMigrated(totalMigrated ? totalMigrated.toNumber() : 0);
  }, [totalMigrated]);

  useEffect(() => {
    setMyTotalSupply(totalSupply ? totalSupply.toNumber() : 0);
  }, [totalSupply]);

  useEffect(() => {
    setMyOldTotalSupply(oldTotalSupply ? oldTotalSupply.toNumber() : 0);
  }, [oldTotalSupply]);

  useEffect(() => {
    setMyBloot(bloot ? bloot.toNumber() : 0);
  }, [bloot]);

  useEffect(() => {
    setMyCurrentFreeMint(currentFreeMint ? currentFreeMint.toNumber() : 0);
  }, [currentFreeMint]);

  useEffect(() => {
    setMyCurrentDonated001(currentDonated001 ? currentDonated001.toNumber() : 0);
  }, [currentDonated001]);

  useEffect(() => {
    setMyCurrentDonated004(currentDonated004 ? currentDonated004.toNumber() : 0);
  }, [currentDonated004]);
  
  useEffect(() => {
    setMyCurrentHonorary(currentHonorary ? currentHonorary.toNumber() : 0);
  }, [currentHonorary]);

  useEffect(() => {
    doPostTransaction(state);
  }, [state]);

  async function handleMint() {
    let donateValue = "";
    if (donateType === "1")
      donateValue = "0.0";
    if (donateType === "2")
      donateValue = "0.01";
    if (donateType === "3")
      donateValue = "0.04";
    if (donateType === "4")
      donateValue = "0.5";

    await safeMint({
      value: utils.parseEther(donateValue),
    });
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
        msg = "Mint failed, Note: If you have got elves before, burn and migrate first. Also, you need at least one Bloot. Each Bloot can mint no more than 2x Bloot Elves.";
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
            return <NFTImage account={account} index={index} key={index}/>
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
      <Button style={{backgroundColor:"#04ff00"}} size="lg" marginTop="5" onClick={handleMint} disabled={account ? (myMintPaused ? true: false) : true} width="25%">
        Mint New Elf
      </Button>
      <Text color="white" fontSize="2xl" marginTop="2px">
        {(myTotalSupply + myOldTotalSupply - mytotalMigrated)}/5000
      </Text>
      {myMintPaused ? (
        <Text color="red" fontSize="2xl" marginTop="2px">
          Minting is: Paused
        </Text>
      ) : (
        <Text color="#03f303" fontSize="2xl" marginTop="2px">
          Minting is: Live
        </Text>
      )}
      <RadioGroup color="white" marginTop="10" marginBottom="30" defaultValue="1" value={donateType} onChange={setDonateType}>
        <Stack spacing={5} direction="column">
          <Radio value="1">Free Mint ({(originalFreeMint + myCurrentFreeMint)}/2600)</Radio>
          <Radio value="2">Donate 0.01eth for 50% chance of rarer traits ({(originalDonated001 + myCurrentDonated001)}/2000)</Radio>
          <Radio value="3">Donate 0.04eth for cameo of your Elves in future content ({(originalDonated004 + myCurrentDonated004)}/300)</Radio>
          <Radio value="4">Donate 0.5eth for status of Honorary Elf ({(originalHonorary + myCurrentHonorary)}/100)</Radio>
        </Stack>
      </RadioGroup>
      <Text color="#666666" fontSize="22px">
      Total elves migrated: {mytotalMigrated - 3} / 1484
      </Text>
    </Flex>
  );
}
