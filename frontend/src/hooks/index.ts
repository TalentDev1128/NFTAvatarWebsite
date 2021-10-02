import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractCall, useContractFunction } from "@usedapp/core";
import simpleContractAbi from "../abi/SimpleContract.json";
import simpleContractAbiOld from "../abi/SimpleContractOld.json";
import { simpleContractAddress, simpleContractAddressOld } from "../contracts";

const simpleContractInterface = new ethers.utils.Interface(simpleContractAbi);
const simpleContractInterfaceOld = new ethers.utils.Interface(simpleContractAbiOld);
const contract = new Contract(simpleContractAddress, simpleContractInterface);
const oldContract = new Contract(simpleContractAddressOld, simpleContractInterfaceOld);

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

export function GetOldTotalSupply() {
  const [balance]: any =
    useContractCall({
      abi: simpleContractInterfaceOld,
      address: simpleContractAddressOld,
      method: "totalSupply",
      args: [],
    }) ?? [];
  return balance;
}

export function GetTotalMigrate(owner: any) {
  const [balance]: any =
    useContractCall({
      abi: simpleContractInterfaceOld,
      address: simpleContractAddressOld,
      method: "balanceOf",
      args: [owner],
    }) ?? [];
  return balance;
}

export function IsApprovedForAll(owner: any, operator: any) {
  const [approved]: any =
    useContractCall({
      abi: simpleContractInterfaceOld,
      address: simpleContractAddressOld,
      method: "isApprovedForAll",
      args: [owner, operator],
    }) ?? [];
  return approved;
}

export function IsPausedMint() {
  const [paused]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "isPausedMint",
      args: [],
    }) ?? [];
  return paused;
}

export function IsPausedMigration() {
  const [paused]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "isPausedMigration",
      args: [],
    }) ?? [];
  return paused;
}

export function GetCurrentFreeMint() {
  const [freeMint]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "currentFreeMint",
      args: [],
    }) ?? [];
  return freeMint;
}

export function GetCurrentDonated001() {
  const [donated001]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "currentDonated001",
      args: [],
    }) ?? [];
  return donated001;
}

export function GetCurrentDonated004() {
  const [donated004]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "currentDonated004",
      args: [],
    }) ?? [];
  return donated004;
}

export function GetCurrentHonorary() {
  const [honorary]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "currentHonorary",
      args: [],
    }) ?? [];
  return honorary;
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

export function GetOwnerOf(tokenId: any) {
  const [owner]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "ownerOf",
      args: [tokenId],
    }) ?? [];
  return owner;
}

export function GetTokenByIndex(index: any) {
  const [tokenId]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "tokenByIndex",
      args: [index],
    }) ?? [];
  return tokenId;
}

export function GetBloot(owner: any) {
  const [balance]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "orginalBalanceOf",
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

export function GetOldTokenOfOwnerByIndex(owner: any) {
  const [tokenId]: any =
    useContractCall({
      abi: simpleContractInterface,
      address: simpleContractAddress,
      method: "getOldElfTokenID",
      args: [owner],
    }) ?? [];
  return tokenId;
}

export function GetOldTokenURI(tokenId: any) {
  const [tokenURI]: any =
    useContractCall({
      abi: simpleContractInterfaceOld,
      address: simpleContractAddressOld,
      method: "tokenURI",
      args: [tokenId],
    }) ?? [];
  return tokenURI;
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

export function useOldContractMethod(methodName: string) {
  // @ts-ignore
  const { state, send } = useContractFunction(oldContract, methodName, {});
  return { state, send };
}
