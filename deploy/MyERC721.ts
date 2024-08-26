import assert from 'assert'

import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'MyERC721Mock'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    const endpointV2Deployment = await hre.deployments.get('EndpointV2')

    // If the oftAdapter configuration is defined on a network that is deploying an OFT,
    // the deployment will log a warning and skip the deployment
    // if (hre.network.config.oftAdapter != null) {
    //     console.warn(`oftAdapter configuration found on OFT deployment, skipping OFT deployment`)
    //     return
    // }

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [
            'Not ONFT', // name
            'nONFT', // symbol
            endpointV2Deployment.address, // LayerZero's EndpointV2 address
            deployer, // owner
        ],
        log: true,
        skipIfAlreadyDeployed: true,
    })

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
}

deploy.tags = [contractName]

export default deploy
