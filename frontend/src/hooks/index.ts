import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractCall, useContractFunction } from "@usedapp/core";
import simpleContractAbi from "../abi/SimpleContract.json";
import { simpleContractAddress } from "../contracts";

const simpleContractInterface = new ethers.utils.Interface(simpleContractAbi);
const contract = new Contract(simpleContractAddress, simpleContractInterface);

export function GetTotalSupply() {
  const [balance]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "totalSupply",
      args: [],
    }) ?? [];
  return balance;
}

export function GetBalance(owner: any) {
  const [balance]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "balanceOf",
      args: [owner],
    }) ?? [];
  return balance;
}

export function GetTokenOfOwnerByIndex(owner: any, index: any) {
  const [tokenId]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "tokenOfOwnerByIndex",
      args: [owner, index],
    }) ?? [];
  return tokenId;
}

export function GetTokenURI(tokenId: any) {
  const [tokenURI]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "tokenURI",
      args: [tokenId],
    }) ?? [];
  return tokenURI;
}

export function useContractMethod(methodName: string) {
  // @ts-ignore
  const { state, send } = useContractFunction(contract, methodName, {});
  return { state, send };
}
