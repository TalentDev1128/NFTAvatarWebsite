const BlootElves = artifacts.require('BlootElves')

module.exports = async (deployer, network, [defaultAccount]) => {
  BlootElves.setProvider(deployer.provider)
  if (network.startsWith('rinkeby')) {
    await deployer.deploy(BlootElves)
    let dnd = await BlootElves.deployed()
  } else if (network.startsWith('mainnet')) {
    console.log("If you're interested in early access to Chainlink VRF on mainnet, please email vrf@chain.link")
  } else {
    console.log("Right now only rinkeby works! Please change your network to Rinkeby")
  }
}
