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
const opSepoliaAdapter: OmniPointHardhat = {
    eid: EndpointId.OPTSEP_V2_TESTNET,
    contractName: 'MyOFTAdapterMock',
}

const arbSepoliaOFT: OmniPointHardhat = {
    eid: EndpointId.ARBSEP_V2_TESTNET,
    contractName: 'MyOFTMock',
}

const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: opSepoliaAdapter,
        },
        {
            contract: arbSepoliaOFT,
        },
    ],
    connections: [
        {
            from: opSepoliaAdapter,
            to: arbSepoliaOFT,
        },
        {
            from: arbSepoliaOFT,
            to: opSepoliaAdapter,
        },
    ],
}

export default config
