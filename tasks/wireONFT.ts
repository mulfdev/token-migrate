import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

task('wire:onft')
    .addParam('srcaddress', 'token address on source chain')
    .addParam('destaddress', 'OFT address on destination chain')
    .addParam('desteid', 'destination endpoint id')
    .addParam('srceid', 'source destination id')
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { ethers, deployments } = hre

        const [signer] = await ethers.getSigners()

        await deployments.all()
    })
