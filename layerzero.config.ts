import { EndpointId } from '@layerzerolabs/lz-definitions'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

/**
 *  WARNING: ONLY 1 OFTAdapter should exist for a given global mesh.
 *  The token address for the adapter should be defined in hardhat.config. This will be used in deployment.
 *
 *  for example:
 *
 *    sepolia: {
 *         eid: EndpointId.SEPOLIA_V2_TESTNET,
 *         url: process.env.RPC_URL_SEPOLIA || 'https://rpc.sepolia.org/',
 *         accounts,
 *         oft-adapter: {
 *             tokenAddress: '0x0', // Set the token address for the OFT adapter
 *         },
 *     },
 */
const ArbitrumOFTAdapter: OmniPointHardhat = {
    eid: EndpointId.ARBSEP_V2_TESTNET,
    contractName: 'ArbitrumOFTAdapter',
}

const TreasureOFT: OmniPointHardhat = {
    eid: EndpointId.TREASURE_V2_TESTNET,
    contractName: 'TreasureOFT',
}

const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: ArbitrumOFTAdapter,
        },
        {
            contract: TreasureOFT,
        },
    ],
    connections: [
        {
            from: ArbitrumOFTAdapter,
            to: TreasureOFT,
            config: {
                sendConfig: {
                    ulnConfig: {
                        confirmations: BigInt(5),
                        requiredDVNs: [
                            '0x9f529527a6810f1b661fb2aeea19378ce5a2c23e',
                            '0x53f488e93b4f1b60e8e83aa374dbe1780a1ee8a8',
                        ],
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(5),
                        requiredDVNs: [
                            '0x9f529527a6810f1b661fb2aeea19378ce5a2c23e',
                            '0x53f488e93b4f1b60e8e83aa374dbe1780a1ee8a8',
                        ],
                    },
                },
            },
        },
        {
            from: TreasureOFT,
            to: ArbitrumOFTAdapter,
            config: {
                sendConfig: {
                    ulnConfig: {
                        confirmations: BigInt(5),
                        requiredDVNs: ['0xf49d162484290eaead7bb8c2c7e3a6f8f52e32d6'],
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(5),
                        requiredDVNs: ['0xf49d162484290eaead7bb8c2c7e3a6f8f52e32d6'],
                    },
                },
            },
        },
    ],
}

export default config
