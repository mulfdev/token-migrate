import { deployments, ethers, network } from 'hardhat'

import { Options } from '@layerzerolabs/lz-v2-utilities'

import { MyOFTAdapterMock__factory } from '../typechain-types'

import type { SendParamStruct } from '../typechain-types/contracts/MyOFTAdapter'

import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'

export async function getOptions() {
    const GAS_LIMIT = 200_000 // Gas limit for the executor
    const MSG_VALUE = 0 // msg.value for the lzReceive() function on destination in wei

    const _options = Options.newOptions().addExecutorLzReceiveOption(GAS_LIMIT, MSG_VALUE)

    console.info('Formatted Options:\n', _options.toHex(), '\n')

    return _options.toHex()
}

async function main() {
    const argv = await yargs(hideBin(process.argv))
        .option('network', {
            type: 'string',
            description: 'Network to use',
            default: 'opSepolia',
        })
        .option('dsteid', {
            type: 'number',
            description: 'Destination endpoint ID',
            default: 40231,
        })
        .option('to', {
            type: 'string',
            description: 'Recipient address',
            default: '0x000000000000000000000000A97DF2caEee5a658DE1fBC3A22dB088a122e2Cd6',
        })
        .option('amount', {
            type: 'string',
            description: 'Amount to send (in ether)',
            default: '10',
        })
        .option('minamount', {
            type: 'string',
            description: 'Minimum amount to send (in ether)',
            default: '10',
        })
        .option('extraoptions', {
            type: 'string',
            description: 'Extra options',
            default: '0x00030100110100000000000000000000000000030d40',
        })
        .option('composemsg', {
            type: 'string',
            description: 'Compose message',
            default: '0x',
        })
        .option('oftcmd', {
            type: 'string',
            description: 'OFT command',
            default: '0x',
        }).argv

    // Set the network
    if (network.name !== argv.network) {
        console.log(`Switching to network: ${argv.network}`)
        await network.provider.request({
            method: 'hardhat_changeNetwork',
            params: [{ networkName: argv.network }],
        })
    }

    await deployments.all()

    const OFTAdapterMockDeployment = await deployments.get('MyOFTAdapterMock')

    const OFTAdapterMock = MyOFTAdapterMock__factory.connect(OFTAdapterMockDeployment.address, ethers.provider)
    const sendParam: SendParamStruct = {
        dstEid: argv.dstEid,
        to: argv.to,
        amountLD: ethers.utils.parseEther(argv.amount),
        minAmountLD: ethers.utils.parseEther(argv.minAmount),
        extraOptions: argv.extraOptions,
        composeMsg: argv.composeMsg,
        oftCmd: argv.oftCmd,
    }
    const result = await OFTAdapterMock.quoteSend(sendParam, false)

    console.log('quote\n', result[0].toString())
}

main()
    .then((e) => {
        console.log('\nrun complete\n')
        if (typeof e !== 'undefined') {
            console.log(e)
        }
    })
    .catch((err) => {
        throw new Error(err)
    })
