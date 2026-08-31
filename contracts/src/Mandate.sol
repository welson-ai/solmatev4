// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Mandate
/// @notice A revocable mandate the user grants Solmate. Defined in plain code so the agent
///         can never exceed the envelope, and a bank/regulator can inspect what was allowed.
contract Mandate {
    error NotOwner();
    error MandateRevoked();
    error VenueNotAllowed(address venue);
    error CapExceeded(uint256 amount, uint256 cap);
    error ZeroAddress();

    address public immutable owner;
    address[] public allowedVenues;
    bool public revoked;
    uint256 public revokeTimestamp;

    uint128 public totalCap;
    uint16 public maxDailyLossBps;
    mapping(address venue => uint128 cap) public venueCap;
    mapping(address venue => bool allowed) public venueAllowed;

    event MandateConfigured(address indexed owner);
    event VenueConfigured(address indexed venue, uint128 cap, bool enabled);
    event MandateRevocation(address indexed owner, uint256 timestamp);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(uint128 totalCap_, uint16 maxDailyLossBps_) {
        owner = msg.sender;
        if (maxDailyLossBps_ > 10_000) revert CapExceeded(maxDailyLossBps_, 10_000);
        totalCap = totalCap_;
        maxDailyLossBps = maxDailyLossBps_;
        emit MandateConfigured(msg.sender);
    }

    /// @dev Owner sets/updates a venue cap. Disabling removes the venue from the allow list.
    function configureVenue(address venue, uint128 cap, bool enabled) external onlyOwner {
        if (enabled && venue == address(0)) revert ZeroAddress();
        venueAllowed[venue] = enabled;
        venueCap[venue] = cap;
        if (enabled) {
            _upsertAllowed(venue);
        } else {
            _removeAllowed(venue);
        }
        emit VenueConfigured(venue, cap, enabled);
    }

    /// @dev Instant kill switch. Once revoked the mandate can no longer authorise moves.
    function revoke() external onlyOwner {
        revoked = true;
        revokeTimestamp = block.timestamp;
        emit MandateRevocation(msg.sender, block.timestamp);
    }

    /// @dev Validate a proposed move against the envelope. Called by the account before signing.
    function validateMove(address venue, uint256 amount) external view {
        if (revoked) revert MandateRevoked();
        if (!venueAllowed[venue]) revert VenueNotAllowed(venue);
        uint128 cap = venueCap[venue];
        if (cap != 0 && amount > cap) revert CapExceeded(amount, cap);
        if (totalCap != 0 && amount > totalCap) revert CapExceeded(amount, totalCap);
    }

    function allowedVenuesCount() external view returns (uint256) {
        return allowedVenues.length;
    }

    function _upsertAllowed(address venue) private {
        for (uint256 i = 0; i < allowedVenues.length; i++) {
            if (allowedVenues[i] == venue) return;
        }
        allowedVenues.push(venue);
    }

    function _removeAllowed(address venue) private {
        uint256 len = allowedVenues.length;
        for (uint256 i = 0; i < len; i++) {
            if (allowedVenues[i] == venue) {
                allowedVenues[i] = allowedVenues[len - 1];
                allowedVenues.pop();
                return;
            }
        }
    }
}