const BlootElvesReborn = artifacts.require('BlootElvesReborn')

module.exports = async (deployer, network, [defaultAccount]) => {
  BlootElvesReborn.setProvider(deployer.provider)
  if (network.startsWith('rinkeby')) {
    await deployer.deploy(BlootElvesReborn)
    let dnd = await BlootElvesReborn.deployed()
  } else if (network.startsWith('mainnet')) {
    console.log("If you're interested in early access to Chainlink VRF on mainnet, please email vrf@chain.link")
  } else {
    console.log("Right now only rinkeby works! Please change your network to Rinkeby")
  }
}
