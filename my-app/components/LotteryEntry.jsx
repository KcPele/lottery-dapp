import React, { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { useMoralis } from "react-moralis";
import { abi, contractAddress } from "../constants";
import { ethers } from "ethers";
import { useNotification } from "web3uikit"
const LotteryEntry = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");
  const dispatch = useNotification();

  const raffleAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;
  const { runContractFunction: enterRaffle, isFetching, isLoading } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });
  async function updateUI() {
    const entranceFeeFromContract = (await getEntranceFee()).toString();
    const numPlayersFromContract = (await getNumberOfPlayers()).toString();
    const recentWinnersFromContract = await getRecentWinner()
    setEntranceFee(entranceFeeFromContract);
    setNumPlayers(numPlayersFromContract)
    setRecentWinner(recentWinnersFromContract)

  }
  useEffect(() => {
    if (isWeb3Enabled) {
      
      updateUI();
    }
  }, [isWeb3Enabled]);
  const handleSuccess = async (tx) => {
      await tx.wait(1)
      handleNewNotification(tx)
      updateUI() 
  }

  const handleNewNotification = function (){
    dispatch({
      type: "info",
      message: 'Transaction Complete!',
      title: 'Tx Notification',
      icon: "bell",
      position: "topR"
    })
  }
  return (
    <>
      {raffleAddress ? (
        <div>
          <button onClick={async function() {
            await enterRaffle({
              onSuccess: handleSuccess,
              onError: (error) => console.log(error),
            })
          }} disabled={isLoading || isFetching }>Enter Raffle</button>
          <div>
            LotteryEntry Entransce fee{" "}
            {ethers.utils.formatUnits(entranceFee, "ether")}ETH.
            <p>Number of Players {numPlayers}</p>
            <p>Recent Winner: {recentWinner}</p>
          </div>
        </div>
      ) : (
        <div>No Raffle address detected</div>
      )}
    </>
  );
};

export default LotteryEntry;
