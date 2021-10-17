import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractCall, useContractFunction } from "@usedapp/core";
import ElvesContractABI from "../abi/ElvesContract.json";
import BlootContractABI from "../abi/BlootContract.json";
import DerivativeContractABI from "../abi/DerivativeContract.json";
import { elvesContractAddress, blootContractAddress, derivativeContractAddress } from "../contracts";

const elvesContractInterface = new ethers.utils.Interface(ElvesContractABI);
const blootContractInterface = new ethers.utils.Interface(BlootContractABI);
const derivativeContractInterface = new ethers.utils.Interface(DerivativeContractABI);

const elvesContract = new Contract(elvesContractAddress, elvesContractInterface);
const blootContract = new Contract(blootContractAddress, blootContractInterface);
const derivativeContract = new Contract(derivativeContractAddress, derivativeContractInterface);

export function GetTotalSupply() {
  const [balance]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "totalSupply",
      args: [],
    }) ?? [];
  return balance;
}

export function GetOldTotalSupply() {
  const [balance]: any =
    useContractCall({
      abi: blootContractInterface,
      address: blootContractAddress,
      method: "totalSupply",
      args: [],
    }) ?? [];
  return balance;
}

export function GetTotalMigrate(owner: any) {
  const [balance]: any =
    useContractCall({
      abi: blootContractInterface,
      address: blootContractAddress,
      method: "balanceOf",
      args: [owner],
    }) ?? [];
  return balance;
}

export function IsApprovedForAll(owner: any, operator: any) {
  const [approved]: any =
    useContractCall({
      abi: blootContractInterface,
      address: blootContractAddress,
      method: "isApprovedForAll",
      args: [owner, operator],
    }) ?? [];
  return approved;
}

export function IsPausedMint() {
  const [paused]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "isPausedMint",
      args: [],
    }) ?? [];
  return paused;
}

export function IsPausedMigration() {
  const [paused]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "isPausedMigration",
      args: [],
    }) ?? [];
  return paused;
}

export function IsPausedClaimingToy() {
  const [paused]: any =
    useContractCall({
      abi: derivativeContractInterface,
      address: derivativeContractAddress,
      method: "isPausedClaimingToy",
      args: [],
    }) ?? [];
  return paused;
}

export function IsPausedClaimingPainting() {
  const [paused]: any =
    useContractCall({
      abi: derivativeContractInterface,
      address: derivativeContractAddress,
      method: "isPausedClaimingPainting",
      args: [],
    }) ?? [];
  return paused;
}

export function IsPausedClaimingStatteute() {
  const [paused]: any =
    useContractCall({
      abi: derivativeContractInterface,
      address: derivativeContractAddress,
      method: "isPausedClaimingStatteute",
      args: [],
    }) ?? [];
  return paused;
}

export function GetCurrentFreeMint() {
  const [freeMint]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "currentFreeMint",
      args: [],
    }) ?? [];
  return freeMint;
}

export function GetCurrentDonated001() {
  const [donated001]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "currentDonated001",
      args: [],
    }) ?? [];
  return donated001;
}

export function GetCurrentDonated004() {
  const [donated004]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "currentDonated004",
      args: [],
    }) ?? [];
  return donated004;
}

export function GetCurrentHonorary() {
  const [honorary]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "currentHonorary",
      args: [],
    }) ?? [];
  return honorary;
}

export function GetElvesBalance(owner: any) {
  const [balance]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "balanceOf",
      args: [owner],
    }) ?? [];
  return balance;
}

export function GetDerivativeBalance(owner: any) {
  const [balance]: any =
    useContractCall({
      abi: derivativeContractInterface,
      address: derivativeContractAddress,
      method: "balanceOf",
      args: [owner],
    }) ?? [];
  return balance;
}

export function GetOwnerOf(tokenId: any) {
  const [owner]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "ownerOf",
      args: [tokenId],
    }) ?? [];
  return owner;
}

export function GetTokenByIndex(index: any) {
  const [tokenId]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "tokenByIndex",
      args: [index],
    }) ?? [];
  return tokenId;
}

export function GetBloot(owner: any) {
  const [balance]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "orginalBalanceOf",
      args: [owner],
    }) ?? [];
  return balance;
}

export function GetElvesTokenOfOwnerByIndex(owner: any, index: any) {
  const [tokenId]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "tokenOfOwnerByIndex",
      args: [owner, index],
    }) ?? [];
  return tokenId;
}

export function GetBlootTokenOfOwnerByIndex(owner: any) {
  const [tokenId]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "getOldElfTokenID",
      args: [owner],
    }) ?? [];
  return tokenId;
}

export function GetDerivativeTokenOfOwnerByIndex(owner: any, index: any) {
  const [tokenId]: any =
    useContractCall({
      abi: derivativeContractInterface,
      address: derivativeContractAddress,
      method: "tokenOfOwnerByIndex",
      args: [owner, index],
    }) ?? [];
  return tokenId;
}

export function GetDerivativesToClaim(owner: any, category: any) {
  const [remain]: any =
    useContractCall({
      abi: derivativeContractInterface,
      address: derivativeContractAddress,
      method: "getDerivativesToClaim",
      args: [owner, category],
    }) ?? [];
  return remain;
}

export function GetDerivativeTokenURI(tokenId: any) {
  const [tokenURI]: any =
    useContractCall({
      abi: derivativeContractInterface,
      address: derivativeContractAddress,
      method: "tokenURI",
      args: [tokenId],
    }) ?? [];
  return tokenURI;
}

export function GetElvesTokenURI(tokenId: any) {
  const [tokenURI]: any =
    useContractCall({
      abi: elvesContractInterface,
      address: elvesContractAddress,
      method: "tokenURI",
      args: [tokenId],
    }) ?? [];
  return tokenURI;
}

export function useElvesContractMethod(methodName: string) {
  // @ts-ignore
  const { state, send } = useContractFunction(elvesContract, methodName, {});
  return { state, send };
}

export function useBlootContractMethod(methodName: string) {
  // @ts-ignore
  const { state, send } = useContractFunction(blootContract, methodName, {});
  return { state, send };
}

export function useDerivativeContractMethod(methodName: string) {
  // @ts-ignore
  const { state, send } = useContractFunction(derivativeContract, methodName, {});
  return { state, send };
}
