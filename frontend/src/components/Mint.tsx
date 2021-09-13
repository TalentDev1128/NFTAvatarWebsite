import { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Button,
  Checkbox
} from "@chakra-ui/react";
import NFTImage from "./NFTImage"
import { utils } from "ethers";
import { useEthers } from "@usedapp/core";
import {
  GetBalance,
  useContractMethod
} from "../hooks";

import { getMetaData } from "../services/Metadata"

export default function Mint() {

  const { account } = useEthers();
  const balance = GetBalance(account);
  const { state, send: safeMint } = useContractMethod("requestNewRandomCharacter");
  const [myBalance, setMyBalance] = useState(0);

  useEffect(() => {
    setMyBalance(balance ? balance.toNumber() : 0);
  }, [balance]);

  async function handleMint() {
    const metadata = await getMetaData();
    safeMint(balance, metadata, {
      value: utils.parseEther("0.001"),
    });
  }

  return (
    <Flex direction="column" align="center" mt="4">
      {account ? (
        <Flex direction="row" align="center" mt="2">
          {Array.from(Array(myBalance).keys()).map((index) => {
            return <NFTImage account={account} index={index}/>
          })}
        </Flex>
        ) : (
          <Text></Text>
        )
      }
      <Text color="white" fontSize="6xl">
        {account ? '' : 'Not found your NFT'}
      </Text>
      <Button colorScheme="teal" size="lg" marginTop="5" onClick={handleMint} disabled={account ? false : true}>
        Mint Avatar
      </Button>
      <Checkbox color="white" marginTop="10" disabled={account ? false : true}>Donate 0.01eth</Checkbox>
    </Flex>
  );
}
