import { Options } from '@layerzerolabs/lz-v2-utilities'
import { ethers, BigNumber, type ContractTransaction } from 'ethers'

const GAS_LIMIT = 200_000 // Gas limit for the executor
const MSG_VALUE = 0 // msg.value for the lzReceive() function on destination in wei

export async function getOptions() {
    const _options = Options.newOptions().addExecutorLzReceiveOption(GAS_LIMIT, MSG_VALUE)

    console.info('Formatted Options:\n', _options.toHex(), '\n')

    return _options.toHex()
}

export class FifoQueue {
    private queue: ethers.ContractTransaction[] = []
    private provider: ethers.providers.Provider
    private wallet: ethers.Wallet

    constructor(provider: ethers.providers.Provider, wallet: ethers.Wallet) {
        this.provider = provider
        this.wallet = wallet
    }

    async checkPendingTx(): Promise<Boolean> {
        const txCount = await this.provider.getTransactionCount(this.wallet.address, 'pending')
        const nonce = await this.provider.getTransactionCount(this.wallet.address, 'latest')

        if (nonce > txCount) {
            console.warn('Wallet has pending txs')
            return true
        } else {
            return false
        }
    }

    async addTransaction(txFunction: () => Promise<ContractTransaction>) {
        const tx = await txFunction()
        this.queue.push(tx)
    }
}
