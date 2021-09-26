import { useEffect, useState } from "react";
import {
  Flex,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import ReactLoading from 'react-loading';
import {
  useContractMethod, useOldContractMethod, GetBalance, GetTotalMigrate, GetOldTokenOfOwnerByIndex
} from "../hooks";
import { simpleContractAddress } from "../contracts";

import { getOldIDs, saveMigrateSuccess } from "../services/Metadata";

export default function Migrate() {

  const { account } = useEthers();
  const balance = GetBalance(account);
  const balanceMigrate = GetTotalMigrate(account);
  const tokenID = GetOldTokenOfOwnerByIndex(account, 0);
  const { state: migrateState, send: migrate } = useContractMethod("migrate");
  const { state: approvalState, send: setApprovalForAll } = useOldContractMethod("setApprovalForAll");
  const [showLoading, setShowLoading] = useState(false);
  const [myMigrate, setMyMigrate] = useState(0);
  const toast = useToast();
  const divStyle = {
    display: 'none'
  };

  useEffect(() => {
    setMyMigrate(balanceMigrate ? balanceMigrate.toNumber() : 0);
  }, [balanceMigrate]);

  useEffect(() => {
    doPostTransaction(migrateState);
    if (migrateState.status === "Success") {
      saveMigrateSuccess(account);
    }
  }, [migrateState]);

  useEffect(() => {
    doPostTransaction(approvalState);
  }, [approvalState]);

  async function handleMigrate() {
    if (myMigrate === 0) {
      toast({
        description: "You don't have any elves to migrate.",
        status: "warning",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }
    setShowLoading(true);
    let tokenIDs = [tokenID.toNumber()];
    console.log(tokenID);
    console.log(tokenIDs);
    const { ids, status } = await getOldIDs(tokenIDs);
    // const { ids, status } = await getOldIDs("0x0ACD3b41e5B21e8b23b2ED054645316a9B1Db28");
    console.log(ids);
    console.log(status);
    setShowLoading(false);
    if (status !== "success") {
      toast({
        description: "Can't migrate. Approve first or contact administrator, please.",
        status: "warning",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    };
    await migrate(ids);
  }

  async function handleApprove() {
    if (myMigrate === 0) {
      toast({
        description: "You don't have any elves to migrate.",
        status: "warning",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }
    await setApprovalForAll(simpleContractAddress, true);
  }

  function doPostTransaction(state: any) {
    let msg = "";
    console.log(state);
    switch (state.status) {
      case "Success":
        msg = "Success";
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
        msg = "Processing";
        toast({
          description: msg,
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      break;
      case "Fail":
        msg = "Transaction failed";
        toast({
          description: msg,
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      break;
      case "Exception":
        msg = "Exception";
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
      <Text color="white" fontSize="4xl" marginTop="5px" marginBottom="5px">
        {'You have ' + myMigrate + ' elf(s) to migrate'}
      </Text>
      <Button colorScheme="teal" size="lg" marginTop="5" onClick={handleApprove} disabled={account ? (myMigrate > 0 ? false : true) : true} width="25%">
        Approve
      </Button>
      <Button colorScheme="teal" size="lg" marginTop="5" onClick={handleMigrate} disabled={account ? (myMigrate > 0 ? false : true) : true} width="25%">
        Burn & Migrate
      </Button>
      <div style={showLoading? undefined: divStyle}>
        <ReactLoading type="spinningBubbles" color="#ffffff" height={80} width={80} />
      </div>
    </Flex>
  );
}
