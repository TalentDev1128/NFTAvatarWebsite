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
  useElvesContractMethod, useBlootContractMethod, IsApprovedForAll, GetTotalMigrate, GetBlootTokenOfOwnerByIndex, IsPausedMigration
} from "../hooks";
import { elvesContractAddress } from "../contracts";

import { getOldIDs, saveMigrateSuccess } from "../services/Metadata";

export default function Migrate() {

  const { account } = useEthers();
  const balanceMigrate = GetTotalMigrate(account);
  const { state: migrateState, send: migrate } = useElvesContractMethod("migrate");
  const { state: approvalState, send: setApprovalForAll } = useBlootContractMethod("setApprovalForAll");
  const tokenID = GetBlootTokenOfOwnerByIndex(account);
  const isApproved = IsApprovedForAll(account, elvesContractAddress);
  const isPaused = IsPausedMigration();
  const [showLoading, setShowLoading] = useState(false);
  const [myMigrate, setMyMigrate] = useState(0);
  const [myTokenID, setMyTokenID] = useState(0);
  const [myIsApproved, setMyIsApproved] = useState(false);
  const [myMigrationPaused, setMyMigrationPaused] = useState(false);
  const toast = useToast();
  const divStyle = {
    display: 'none'
  };

  useEffect(() => {
    setMyMigrationPaused(isPaused ? isPaused : false);
  }, [isPaused]);

  useEffect(() => {
    setMyIsApproved(isApproved ? isApproved : false);
  }, [isApproved]);

  useEffect(() => {
    setMyMigrate(balanceMigrate ? balanceMigrate.toNumber() : 0);
  }, [balanceMigrate]);

  useEffect(() => {
    setMyTokenID(tokenID ? tokenID.toNumber() : 0);
  }, [tokenID]);

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
    let tokenIDs = [myTokenID];
    const { ids, status } = await getOldIDs(tokenIDs);
    console.log(ids);
    console.log(status);
    setShowLoading(false);
    if (status !== "success") {
      toast({
        description: "Can't migrate. Authorize first or contact administrator, please.",
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
    await setApprovalForAll(elvesContractAddress, true);
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
        msg = "Can't migrate. Authorze first or contact administrator, please.";
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
      <Text color="white" fontSize="4xl" marginTop="5px" marginBottom="5px" textAlign="center">
        {'You have ' + myMigrate + ' elf(s) to migrate'}
      </Text>
      <Button style={{backgroundColor:"#04ff00"}} size="lg" marginTop="5" onClick={handleApprove} disabled={account ? (myIsApproved ? true : (myMigrationPaused ? true: false)) : true} width={["50%","25%"]}>
        Authorize (only once)
      </Button>
      <Button style={{backgroundColor:"#04ff00"}} size="lg" marginTop="5" marginBottom="2" onClick={handleMigrate} disabled={account ? (myMigrate > 0 ? (myIsApproved ? (myMigrationPaused ? true: false) : true) : true) : true} width={["50%","25%"]}>
        Burn & Migrate
      </Button>
      {myMigrationPaused ? (
        <Text color="red" fontSize="2xl" marginTop="2px">
          Migration is: Paused
        </Text>
      ) : (
        <Text color="#03f303" fontSize="2xl" marginTop="2px">
          Migration is: Live
        </Text>
      )}
      <div style={showLoading? undefined: divStyle}>
        <ReactLoading type="spinningBubbles" color="#ffffff" height={80} width={80} />
      </div>
    </Flex>
  );
}
