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
  GetTotalSupply,
  GetBalance,
  useContractMethod
} from "../hooks";

import { getMetaData } from "../services/Metadata"

export default function Mint() {

  const { account } = useEthers();
  const balance = GetBalance(account);
  const totalSupply = GetTotalSupply();
  const { state, send: safeMint } = useContractMethod("requestNewBloot");
  const [myBalance, setMyBalance] = useState(0);
  const [isDonate, setIsDonate] = useState(false);

  useEffect(() => {
    setMyBalance(balance ? balance.toNumber() : 0);
  }, [balance]);

  async function handleMint() {
    const metadata = await getMetaData();
    if (isDonate) {
      safeMint(totalSupply, metadata, {
        value: utils.parseEther("0.001"),
      });
    } else {
      safeMint(totalSupply, metadata);
    }
  }

  function handleDonate(checked: boolean) {
    setIsDonate(checked);
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
      <Text color="white" fontSize="4xl">
        {account ? (myBalance ? '' : 'Not found your NFT') : 'Wallet not connected'}
      </Text>
      <Button colorScheme="teal" size="lg" marginTop="5" onClick={handleMint} disabled={account ? false : true}>
        Mint Avatar
      </Button>
      <Checkbox color="white" marginTop="10" isDisabled={account ? false : true} onChange={(e) => handleDonate(e.target.checked)}>Donate 0.01eth</Checkbox>
    </Flex>
  );
}
