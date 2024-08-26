// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

// endpoint: 0x6C7Ab2202C98C4227C5c46f1417D81144DA716Ff

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

    function mint(address _to, uint256 _amount) public onlyOwnerOrEndpoint {
        _mint(_to, _amount);
    }
}
