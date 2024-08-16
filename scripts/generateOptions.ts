import { deployments, ethers } from 'hardhat'

import { Options } from '@layerzerolabs/lz-v2-utilities'

import { MyOFTAdapterMock__factory } from '../typechain-types'

import type { SendParamStruct } from '../typechain-types/contracts/MyOFTAdapter'

const sendParam: SendParamStruct = {
    dstEid: 40231,
    to: '0x000000000000000000000000A97DF2caEee5a658DE1fBC3A22dB088a122e2Cd6',
    amountLD: ethers.utils.parseEther('10'),
    minAmountLD: ethers.utils.parseEther('10'),
    extraOptions: '0x00030100110100000000000000000000000000030d40',
    composeMsg: '0x',
    oftCmd: '0x',
}

async function main() {
    const GAS_LIMIT = 200_000 // Gas limit for the executor
    const MSG_VALUE = 0 // msg.value for the lzReceive() function on destination in wei

    const _options = Options.newOptions().addExecutorLzReceiveOption(GAS_LIMIT, MSG_VALUE)

    console.info('Formatted Options:\n', _options.toHex(), '\n')
    await deployments.all()

    const OFTAdapterMockDeployment = await deployments.get('MyOFTAdapterMock')

    const OFTAdapterMock = MyOFTAdapterMock__factory.connect(OFTAdapterMockDeployment.address, ethers.provider)

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
