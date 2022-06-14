const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const BASE_FEE = ethers.utils.parseEther("0.25") //0.25 links per request
const GAS_PRICE_LINK = 1e9 //calculated value based on the gas price offer
module.exports = async ({getNamedAccounts, deployments}) => {

    const {deployer } = await getNamedAccounts()
    const { deploy, log } = deployments

    if(developmentChains.includes(network.name)){
        log("Local network detected")
        //deploy a mock vrf coordinator
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: [BASE_FEE, GAS_PRICE_LINK ],
            log: true
        })

        log("Mock Deployed")
        log("-----------------------------------------------------")
    }



}


module.exports.tags = ["all", "mocks"]