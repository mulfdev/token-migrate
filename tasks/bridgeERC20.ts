import { task } from 'hardhat/config'
import { ArbitrumOFTAdapter__factory } from '../typechain-types'

import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { SendParamStruct } from '../typechain-types/contracts/mocks/MyOFTAdapterMock'
import { Options } from '@layerzerolabs/lz-v2-utilities'

// NOTE: Each wallet will need to approve the Adapter as a spender

export async function getOptions() {
    const GAS_LIMIT = 200_000 // Gas limit for the executor
    const MSG_VALUE = 0 // msg.value for the lzReceive() function on destination in wei
    const _options = Options.newOptions().addExecutorLzReceiveOption(GAS_LIMIT, MSG_VALUE)

    console.info('Formatted Options:\n', _options.toHex(), '\n')

    return _options.toHex()
}

task('send:oft', 'Send OFT Cross chain')
    .addParam('to', 'Recipient address')
    .addParam('amount', 'Amount to send (in ether)')
    .addOptionalParam('composemsg', 'Compose message', '0x')
    .addOptionalParam('oftcmd', 'OFT command', '0x')
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { ethers, deployments } = hre

        const [signer] = await ethers.getSigners()

        await deployments.all()

        const OFTAdapterDeployment = await deployments.get('ArbitrumOFTAdapter')
        const OFTAdapter = ArbitrumOFTAdapter__factory.connect(OFTAdapterDeployment.address, signer)

        const sendParam: SendParamStruct = {
            dstEid: parseInt(taskArgs.dsteid),
            to: ethers.utils.hexZeroPad(taskArgs.to, 32),
            amountLD: ethers.utils.parseEther(taskArgs.amount),
            minAmountLD: ethers.utils.parseEther(taskArgs.minamount),
            extraOptions: await getOptions(),
            composeMsg: taskArgs.composemsg,
            oftCmd: taskArgs.oftcmd,
        }

        try {
            const quote = await OFTAdapter.quoteSend(sendParam, false)

            console.log('Quote result:')
            console.log('Native fee:', ethers.utils.formatEther(quote.nativeFee), 'ETH')
            console.log('LZ token fee:', ethers.utils.formatEther(quote.lzTokenFee), 'ETH')
            console.log('Sending OFTs')

            const tx = await OFTAdapter.send(
                sendParam,
                { nativeFee: quote.nativeFee, lzTokenFee: quote.lzTokenFee },
                taskArgs.to,
                {
                    value: quote.nativeFee,
                }
            )
            await tx.wait()
            console.log('TX Sent\n')
            console.log(tx.hash)
        } catch (error) {
            console.error('Error calling quoteSend:', error)
        }
    })
