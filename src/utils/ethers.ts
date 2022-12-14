import { ethers, BigNumber } from "ethers";

import { Token__factory } from "../constants/typechain-types";
import { Factory__factory, Exchange__factory, Multicall__factory, MasterChef__factory } from "../constants/typechain-types";
import { FACTORY_ADDRESSES, MULTICALL_ADDRESSES, MASTERCHEF_ADDRESSES } from "../constants";

export function getProvider() {
    return new ethers.providers.Web3Provider(window.ethereum);
}

export function getSigner() {
    return getProvider().getSigner();
}

export function getMulticallContract(networkId: number) {
    return Multicall__factory.connect(MULTICALL_ADDRESSES[networkId], getSigner());
}

export function getMasterChefContract(networkId: number) {
    return MasterChef__factory.connect(MASTERCHEF_ADDRESSES[networkId], getSigner());
}

export function getExchangeContract(contractAddress: string) {
    return Exchange__factory.connect(contractAddress, getSigner());
}

export function getFactoryContract(networkId: number) {
    console.log(FACTORY_ADDRESSES[networkId])
    return Factory__factory.connect(FACTORY_ADDRESSES[networkId], getSigner());
}

export async function getTokenBalanceAndSymbol(accountAddress:string, tokenAddress:string) {
    const token = Token__factory.connect(tokenAddress, getSigner());
    const symbol = await token.symbol();
    const balance = await token.balanceOf(accountAddress);
    return {
        symbol: symbol,
        balance: ethers.utils.formatEther(balance)
    }
}

export async function getAccountBalance(accountAddress:string) {
    const balance = await getProvider().getBalance(accountAddress);
    return {
        balance: ethers.utils.formatEther(balance),
        symbol: 'ETH'
    }
}

export async function getTokenExchangeAddressFromFactory(tokenAddress: string, networkId: number) {
    return getFactoryContract(networkId).getExchange(tokenAddress);
}


export function fromWei(to: BigNumber) {
    return ethers.utils.formatEther(to.toString());
}

export function toWei(to: string) {
    return ethers.utils.parseEther(to);
}

export async function onEthToTokenSwap(inputAmount: BigNumber, outputAmount: BigNumber, tokenAddress: string, networkId: number) {
    const exchangeAddress = await getFactoryContract(networkId).getExchange(tokenAddress);
    await getExchangeContract(exchangeAddress).ethToTokenSwap(outputAmount, {value: inputAmount});
}

export async function onAddLiquidity(addEthAmount: BigNumber, addTokenAmount: BigNumber, tokenAddress: string, networkId: number) {
    const exchangeAddress = await getFactoryContract(networkId).getExchange(tokenAddress);
    await getExchangeContract(exchangeAddress).addLiquidity(addTokenAmount, {value: addEthAmount});
}