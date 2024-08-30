import 'dotenv/config'

import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import '@layerzerolabs/toolbox-hardhat'
import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'

import '@typechain/hardhat'
import { EndpointId } from '@layerzerolabs/lz-definitions'

import './type-extensions'
import './tasks/bridgeERC20'

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
      ? [PRIVATE_KEY]
      : undefined

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

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
        arbSepolia: {
            eid: EndpointId.ARBSEP_V2_TESTNET,
            url: process.env.ARB_SEPOLIA_URL as string,
            accounts,
            oftAdapter: {
                tokenAddress: '0x5c4Ad33Eb304edc8d0b802d0c0A6b1eeCd4c9c99', // Set the existing token address for the OFT adapter
            },
        },
        ruby: {
            eid: EndpointId.TREASURE_V2_TESTNET,
            url: 'https://ruby.rpc.caldera.xyz/http',
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
