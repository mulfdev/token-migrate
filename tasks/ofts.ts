import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

import { ArbitrumOFTAdapter__factory, IERC20Metadata__factory, ILayerZeroEndpointV2__factory } from '../typechain-types'
import { SendParamStruct } from '../typechain-types/contracts/erc20/ArbitrumOFTAdapter'
import { Options } from '@layerzerolabs/lz-v2-utilities'
import { EndpointId } from '@layerzerolabs/lz-definitions'

const GAS_LIMIT = 200_000 // Gas limit for the executor
const MSG_VALUE = 0 // msg.value for the lzReceive() function on destination in wei

const arbSep = {
    executor: '0x5Df3a1cEbBD9c8BA7F8dF51Fd632A9aef8308897',
    endpointV2: '0x6EDCE65403992e310A62460808c4b910D972f10f',
    sendUln301: '0x92709d5BAc33547482e4BB7dd736f9a82b029c40',
    sendUln302: '0x4f7cd4DA19ABB31b0eC98b9066B9e857B1bf9C0E',
    receiveUln301: '0xa673a180fB2BF0E315b4f832b7d5b9ACB7162273',
    receiveUln302: '0x75Db67CDab2824970131D5aa9CECfC9F69c69636',
    lzExecutor: '0x569AA8BdAc7aa67837749bdBdb74Ad9ee4B073Bf',
}

const ruby = {
    executor: '0x701f3927871EfcEa1235dB722f9E608aE120d243',
    endpointV2: '0x6C7Ab2202C98C4227C5c46f1417D81144DA716Ff',
    sendUln301: '0xB0487596a0B62D1A71D0C33294bd6eB635Fc6B09',
    sendUln302: '0xd682ECF100f6F4284138AA925348633B0611Ae21',
    receiveUln301: '0x073f5b4FdF17BBC16b0980d49f6C56123477bb51',
    receiveUln302: '0xcF1B0F4106B0324F96fEfcC31bA9498caa80701C',
    lzExecutor: '0x4Cf1B3Fa61465c2c907f82fC488B43223BA0CF93',
}

async function getOptions() {
    const _options = Options.newOptions().addExecutorLzReceiveOption(GAS_LIMIT, MSG_VALUE)

    console.info('Formatted Options:\n', _options.toHex(), '\n')

    return _options.toHex()
}

task('deploy:oftAdapterTestnet', 'Deploy OFT Adapter')
    .addParam('existingtkn', 'Existing ERC20 Address on Arbitrum')
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
            arbSep.endpointV2,
            signer.address.toString()
        )
        await adaptedOFT.deployed()

        console.log('OFT Adapter deployed to:', adaptedOFT.address, '\n')

        console.log('Setting Configs\n')

        const lzEndpoint = ILayerZeroEndpointV2__factory.connect(arbSep.endpointV2, signer)
        //
        // const tx1 = await lzEndpoint.setSendLibrary(
        //     adaptedOFT.address,
        //     EndpointId.TREASURE_V2_TESTNET,
        //     arbSep.sendUln302
        // )
        // await tx1.wait()
        //
        // setTimeout(() => {}, 1000)
        //
        // const tx2 = await lzEndpoint.setReceiveLibrary(
        //     adaptedOFT.address,
        //     EndpointId.TREASURE_V2_TESTNET,
        //     arbSep.receiveUln302,
        //     BigInt(0)
        // )
        // await tx2.wait()
        //
        // setTimeout(() => {}, 1000)
        //
        // const tx3 = await lzEndpoint.setReceiveLibraryTimeout(
        //     adaptedOFT.address,
        //     EndpointId.TREASURE_V2_TESTNET,
        //     arbSep.sendUln302,
        //     BigInt(0)
        // )
        // await tx3.wait()
        //
        // setTimeout(() => {}, 1000)

        const ulnConfig = {
            confirmations: 5, // Example value, replace with actual
            requiredDVNCount: 2, // Example value, replace with actual
            optionalDVNCount: 0, // Example value, replace with actual
            optionalDVNThreshold: 0, // Example value, replace with actual
            requiredDVNs: ['0x9f529527a6810f1b661fb2aeea19378ce5a2c23e', '0x53f488e93b4f1b60e8e83aa374dbe1780a1ee8a8'],
            optionalDVNs: [], // Replace with actual addresses if needed
        }

        const executorConfig = {
            maxMessageSize: 0,
            executorAddress: arbSep.executor,
        }

        const configTypeUlnStruct =
            'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)'
        const encodedUlnConfig = ethers.utils.defaultAbiCoder.encode([configTypeUlnStruct], [ulnConfig])

        // Encode ExecutorConfig using defaultAbiCoder
        const configTypeExecutorStruct = 'tuple(uint32 maxMessageSize, address executorAddress)'
        const encodedExecutorConfig = ethers.utils.defaultAbiCoder.encode([configTypeExecutorStruct], [executorConfig])

        // Define the SetConfigParam structs
        const setConfigParamUln = {
            eid: EndpointId.TREASURE_V2_TESTNET,
            configType: 2, // ULN_CONFIG_TYPE
            config: encodedUlnConfig,
        }

        const setConfigParamExecutor = {
            eid: EndpointId.TREASURE_V2_TESTNET,
            configType: 1, // EXECUTOR_CONFIG_TYPE
            config: encodedExecutorConfig,
        }

        const setConfigParam = {
            eid: EndpointId.TREASURE_V2_TESTNET,
            configType: 2, // RECEIVE_CONFIG_TYPE
            config: encodedUlnConfig,
        }
        //
        // const tx4 = await lzEndpoint.setConfig(adaptedOFT.address, arbSep.sendUln302, [
        //     setConfigParamUln,
        //     setConfigParamExecutor,
        // ])
        // await tx4.wait()
        // setTimeout(() => {}, 1000)
        //
        // const tx5 = await lzEndpoint.setConfig(adaptedOFT.address, arbSep.receiveUln302, [setConfigParam])
        // await tx5.wait()
        // setTimeout(() => {}, 1000)
        //

        console.log('config set')
    })

task('send:oft', 'Send OFT Cross chain')
    .addParam('dsteid', 'Destination endpoint ID')
    .addParam('to', 'Recipient address')
    .addParam('amount', 'Amount to send (in ether)')
    .addParam('minamount', 'Minimum amount to send (in ether)')
    .addOptionalParam('composemsg', 'Compose message', '0x')
    .addOptionalParam('oftcmd', 'OFT command', '0x')
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { ethers, deployments } = hre

        const [signer] = await ethers.getSigners()

        await deployments.all()

        const OFTAdapterDeployment = await deployments.get('MyOFTAdapterMock')
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
