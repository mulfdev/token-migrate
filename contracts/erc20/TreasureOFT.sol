// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

contract TreasureOFT is OFT {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
    ) OFT(_name, _symbol, _lzEndpoint, _delegate) Ownable(_delegate) {
        LZ_ENDPOINT = _lzEndpoint;
    }

    address public immutable LZ_ENDPOINT;

    error NotOwnerOrEndpoint();

    modifier onlyOwnerOrEndpoint() {
        if (_msgSender() != owner() || _msgSender() != LZ_ENDPOINT) {
            revert NotOwnerOrEndpoint();
        }
        _;
    }

    /**
     * @dev change this value if your token has nonstandard erc20 decimals value
     */
    function sharedDecimals() public pure override returns (uint8) {
        return 18;
    }

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
