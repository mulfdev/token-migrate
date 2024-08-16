import { http, createConfig } from 'wagmi'
import { arbitrumSepolia, optimismSepolia } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

export const config = createConfig(
    getDefaultConfig({
        chains: [arbitrumSepolia, optimismSepolia],

        transports: {
            [arbitrumSepolia.id]: http(),
            [optimismSepolia.id]: http(),
        }, // Required API Keys
        walletConnectProjectId: import.meta.env.VITE_WC_PROJ,

        // Required App Info
        appName: 'bridge',
    })
)
