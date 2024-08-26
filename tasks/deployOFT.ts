import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

import { ArbitrumOFTAdapter__factory, IERC20Metadata__factory, IERC20Metadata } from '../typechain-types'

const ARBITRUM_ENDPOINT_ADDRESS = '0x6EDCE65403992e310A62460808c4b910D972f10f'
// const RUBY_ENDPOINT_ADDRESS = '0x6C7Ab2202C98C4227C5c46f1417D81144DA716Ff'

task('deploy:oftAdapter', 'Deploy OFT Adapter')
    .addParam('existingtkn', 'Existing ERC20 Address on Arbitrum')
    .addOptionalParam('owner', 'Set owner, otherwise will be deployer')
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { ethers } = hre

        const [signer] = await ethers.getSigners()

        if (!ethers.utils.isAddress(taskArgs.existingtkn)) {
            throw new Error('Incorrect existing token address')
        }

        console.log('Deploying contracts with the account:', signer.address)

        const ContractFactory = new ArbitrumOFTAdapter__factory(signer)
        const adaptedOFT = await ContractFactory.deploy(
            taskArgs.existingtkn,
            ARBITRUM_ENDPOINT_ADDRESS,
            ethers.utils.isAddress(taskArgs.owner) ? taskArgs.owner : signer.address
        )

        console.log('OFT Adapter deployed to:', adaptedOFT.address)
    })
