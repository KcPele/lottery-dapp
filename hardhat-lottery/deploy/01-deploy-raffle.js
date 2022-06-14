const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig, INTERVAL } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30")
module.exports =  async function ({ getNamedAccounts, deployments}) {
   const { deploy, log } = deployments

   const { deployer } = await getNamedAccounts()
   const chainId = network.config.chainId
   let VRFCoordinatorV2MockAddress, subscriptionId

   if(developmentChains.includes(network.name)){
       const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
       VRFCoordinatorV2MockAddress = VRFCoordinatorV2Mock.address;
       const txResponse = await VRFCoordinatorV2Mock.createSubscription()
        const txReceipt = await txResponse.wait(1)
        subscriptionId = txReceipt.events[0].args.subId

        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT )

   } else {
       VRFCoordinatorV2MockAddress =  networkConfig[chainId]["vrfCoordinatorV2"]
       subscriptionId = networkConfig[chainId]["subscriptionId"]
   }
   const entranceFee = networkConfig[chainId]["entranceFee"]
   const gasLane = networkConfig[chainId]["gasLane"]
   const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
   const args = [VRFCoordinatorV2MockAddress, entranceFee, gasLane, subscriptionId,  callbackGasLimit, INTERVAL]
   const raffle = await deploy("Raffle", {
       from: deployer,
       args: args,
       log: true,
       waitConfirmations: network.config.blockConfirmations || 1
   })
   if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
       log("verifying.....")
    await verify(raffle.address, args)
   }
  log("-----------------------------------------")

}

module.exports.tags = ["all", "raffle"]