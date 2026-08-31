// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Mandate} from "./Mandate.sol";

/// @title SolmateAccount
/// @notice Thin per-user smart account (safe-style). Stores the active mandate, binds
///         signing to session keys so a prompt cannot widen the envelope, and emits
///         a receipt for every rebalance. The receipt log is the credit artifact.
contract SolmateAccount {
    error NotOwner();
    error NotAgent();
    error Paused();
    error ZeroAddress();

    struct RebalanceReceipt {
        address operator;
        address fromVenue;
        address toVenue;
        uint256 amount;
        bytes12 reasonCode;
        uint256 realizedUsd;
        uint256 timestamp;
    }

    address public immutable owner;
    Mandate public immutable mandate;
    bool public paused;

    mapping(address signer => bool allowed) public sessionKeys;

    event SessionKeyUpdated(address indexed signer, bool allowed);
    event PausedChanged(bool paused);
    event RebalanceExecuted(RebalanceReceipt receipt);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyAgent() {
        if (!sessionKeys[msg.sender]) revert NotAgent();
        _;
    }

    modifier notPaused() {
        if (paused) revert Paused();
        _;
    }

    constructor(address owner_, address[] memory initialKeys) {
        owner = owner_;
        mandate = new Mandate(0, 0);
        for (uint256 i = 0; i < initialKeys.length; i++) {
            if (initialKeys[i] == address(0)) revert ZeroAddress();
            sessionKeys[initialKeys[i]] = true;
        }
    }

    /// @dev Session key = the agent's router/signer. Owner can bind and revoke at will.
    function setSessionKey(address signer, bool allowed) external onlyOwner {
        if (signer == address(0)) revert ZeroAddress();
        sessionKeys[signer] = allowed;
        emit SessionKeyUpdated(signer, allowed);
    }

    function pause() external onlyOwner {
        paused = true;
        emit PausedChanged(true);
    }

    function resume() external onlyOwner {
        paused = false;
        emit PausedChanged(false);
    }

    function configureVenue(address venue, uint128 cap, bool enabled) external onlyOwner {
        mandate.configureVenue(venue, cap, enabled);
    }

    function revokeMandate() external onlyOwner {
        mandate.revoke();
    }

    /// @dev The only write path the agent has. Everything is checked against the mandate
    ///         before the receipt is emitted; the agent never holds a free-moving key.
    function executeRebalance(
        address fromVenue,
        address toVenue,
        uint256 amount,
        bytes12 reasonCode,
        uint256 realizedUsd
    ) external onlyAgent notPaused {
        mandate.validateMove(toVenue, amount);
        RebalanceReceipt memory receipt = RebalanceReceipt({
            operator: msg.sender,
            fromVenue: fromVenue,
            toVenue: toVenue,
            amount: amount,
            reasonCode: reasonCode,
            realizedUsd: realizedUsd,
            timestamp: block.timestamp
        });
        emit RebalanceExecuted(receipt);
    }
}