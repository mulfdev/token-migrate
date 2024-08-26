import 'dotenv/config'
import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import '@layerzerolabs/toolbox-hardhat'
import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'

import '@typechain/hardhat'
import { EndpointId } from '@layerzerolabs/lz-definitions'

import '../../type-extensions'
import './tasks/sendOFT'

const PRIVATE_KEY = process.env.PRIVATE_KEY

if (typeof PRIVATE_KEY !== 'string') throw new Error('PRIVATE_KEY required')

const accounts: HttpNetworkAccountsUserConfig = [PRIVATE_KEY]

const config: HardhatUserConfig = {
    paths: {
        cache: 'cache/hardhat',
    },
    typechain: {
        outDir: 'typechain-types',
        target: 'ethers-v5',
    },
    solidity: {
        compilers: [
            {
                version: '0.8.22',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    networks: {
        opSepolia: {
            eid: EndpointId.OPTSEP_V2_TESTNET,
            url: process.env.OP_SEPOLIA_URL as string,
            accounts,
            oftAdapter: {
                tokenAddress: '0x173930F6c8040AdB1dfa5d47839EE911eB276442', // Set the token address for the OFT adapter
            },
        },
        arbSepolia: {
            eid: EndpointId.ARBSEP_V2_TESTNET,
            url: process.env.ARB_SEPOLIA_URL as string,
            accounts,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // wallet address of index[0], of the mnemonic in .env
        },
    },
}

export default config
