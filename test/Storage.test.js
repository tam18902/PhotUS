/* eslint-disable no-undef */
// Right click on the script name and hit "Run" to execute
const { expect } = require('chai')
const { ethers } = require('hardhat')
const { createHash } = require('crypto');

describe('Storage', function () {
  let Storage
  let storage
  let owner
  let addrs
  const etherToUsdRate = 3000;
  const numEntries = 75;
  const defaultCID = '9cca0703342e24806a9f64e08c053dca7f2cd90f10529af8ea872afb0a0c77d';
  const defaultKey = '9cca0703342e24806a9f64e08c053dca7f2cd90f10529af8ea872afb0a0c77d';
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Storage = await ethers.getContractFactory('Storage');
    [owner, ...addrs] = await ethers.getSigners()
    // Deploy the contract with initial parameters
    const balanceBefore = await ethers.provider.getBalance(owner.address)
    storage = await Storage.deploy(defaultCID, defaultKey)
    await storage.deployed()
    const balanceAfter = await ethers.provider.getBalance(owner.address)
    console.log('storage deployed at: ' + storage.address)
    const balanceDiff = balanceBefore.sub(balanceAfter)
    const balanceDiffInEther = ethers.utils.formatEther(balanceDiff)
    const balanceDiffInGWei = ethers.utils.formatUnits(balanceDiff, 'gwei')
    const balanceDiffInUsd = balanceDiffInEther * etherToUsdRate
    console.log(`Deployed (in GWei): ${balanceDiffInGWei}`)
    console.log(`Deployed (in Ether): ${balanceDiffInEther}`)
    console.log(`Deployed (in USD): ${balanceDiffInUsd}`)
  })
  it('Creating', async function () {
    storage = await ethers.getContractAt('Storage', storage.address)
    let balanceBefore = await ethers.provider.getBalance(owner.address);
    for (let i = 1; i <= 1; i++) {
      const str = i.toString()
      await storage.connect(owner).createWithViewers((str + defaultCID).slice(0,63), (str + defaultKey).slice(0,63), ["0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678"] )
    }
    /////////////////////////After create
    let balanceAfter = await ethers.provider.getBalance(owner.address)
    let balanceDiff = balanceBefore.sub(balanceAfter)
    let balanceDiffInEther = ethers.utils.formatEther(balanceDiff)
    let balanceDiffInGWei = ethers.utils.formatUnits(balanceDiff, 'gwei')
    let balanceDiffInUsd = balanceDiffInEther * etherToUsdRate
    console.log(`Create (in GWei): ${balanceDiffInGWei}`)
    console.log(`Create (in Ether): ${balanceDiffInEther}`)
    console.log(`Create (in USD): ${balanceDiffInUsd}`)

    // balanceBefore = await ethers.provider.getBalance(owner.address)
    // for (let i = 1; i <= numEntries; i++) {
    //   const str = i.toString()
    //   await storage.connect(owner).grantAccess((str + defaultCID).slice(0,63), ["0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678"] )
    // }
    // ////////////////////////////////After grantAccess
    // balanceAfter = await ethers.provider.getBalance(owner.address)
    // balanceDiff = balanceBefore.sub(balanceAfter)
    // balanceDiffInEther = ethers.utils.formatEther(balanceDiff)
    // balanceDiffInGWei = ethers.utils.formatUnits(balanceDiff, 'gwei')
    // balanceDiffInUsd = balanceDiffInEther * etherToUsdRate
    // console.log(`grantAccess (in Wei): ${balanceDiffInGWei}`)
    // console.log(`grantAccess (in Ether): ${balanceDiffInEther}`)
    // console.log(`grantAccess (in USD): ${balanceDiffInUsd}`)

    balanceBefore = await ethers.provider.getBalance(owner.address)
    // for (let i = 1; i <= numEntries; i++) {
      const gasEstimate = await storage.estimateGas.create(('0' + defaultCID).slice(0,63), (defaultKey).slice(0,63));
      console.log(`Gas estimate for request function: ${gasEstimate.toString()}`);
      const gasPrice = await ethers.provider.getGasPrice();
      const gasCostInWei = gasEstimate.mul(gasPrice);
      const gasCostInEther = ethers.utils.formatEther(gasCostInWei);
      console.log(`Estimated gas cost in Ether: ${gasCostInEther}`);
      await storage.connect("0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678").request()
    // }
    ////////////////////////////////Request
    balanceAfter = await ethers.provider.getBalance(owner.address)
    balanceDiff = balanceBefore.sub(balanceAfter)
    balanceDiffInEther = ethers.utils.formatEther(balanceDiff)
    balanceDiffInGWei = ethers.utils.formatUnits(balanceDiff, 'gwei')
    balanceDiffInUsd = balanceDiffInEther * etherToUsdRate
    console.log(`Request (in GWei): ${balanceDiffInGWei}`)
    console.log(`Request (in Ether): ${balanceDiffInEther}`)
    console.log(`Request (in USD): ${balanceDiffInUsd}`)
  })
})
