// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract WelfareBenefit {
    enum Status { Issued, Redeemed, Expired }

    struct Benefit {
        address recipient;
        uint256 value;
        uint256 expiration;
        address issuingAuthority;
        Status status;
    }

    address public owner;
    mapping(bytes32 => Benefit) public benefits;
    mapping(address => bool) public vendors;

    event BenefitIssued(
        bytes32 indexed benefitId,
        address indexed recipient,
        uint256 value,
        uint256 expiration
    );
    event BenefitRedeemed(
        bytes32 indexed benefitId,
        address indexed recipient,
        address indexed vendor
    );
    event VendorRegistered(address indexed vendor);
    event VendorRemoved(address indexed vendor);

    modifier onlyAdmin() {
        require(msg.sender == owner, "Only admin can call this");
        _;
    }

    modifier onlyVendor() {
        require(vendors[msg.sender], "Only registered vendor can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Issue a new benefit for a recipient.
     */
    function issueBenefit(
        address recipient,
        bytes32 benefitId,
        uint256 value,
        uint256 expiration
    ) external onlyAdmin {
        require(
            benefits[benefitId].issuingAuthority == address(0),
            "Benefit already exists"
        );
        require(expiration > block.timestamp, "Expiration must be in the future");
        benefits[benefitId] = Benefit(
            recipient,
            value,
            expiration,
            msg.sender,
            Status.Issued
        );
        emit BenefitIssued(benefitId, recipient, value, expiration);
    }

    /**
     * @dev Register a vendor address.
     */
    function addVendor(address vendor) external onlyAdmin {
        require(!vendors[vendor], "Vendor already registered");
        vendors[vendor] = true;
        emit VendorRegistered(vendor);
    }

    /**
     * @dev Remove a registered vendor.
     */
    function removeVendor(address vendor) external onlyAdmin {
        require(vendors[vendor], "Vendor not registered");
        vendors[vendor] = false;
        emit VendorRemoved(vendor);
    }

    /**
     * @dev Redeem an issued benefit by a registered vendor.
     */
    function redeemBenefit(bytes32 benefitId, address recipient) external onlyVendor {
        Benefit storage b = benefits[benefitId];
        require(b.issuingAuthority != address(0), "Benefit does not exist");
        require(b.status == Status.Issued, "Benefit not available for redemption");
        require(block.timestamp <= b.expiration, "Benefit expired");
        require(b.recipient == recipient, "Invalid recipient");
        b.status = Status.Redeemed;
        emit BenefitRedeemed(benefitId, recipient, msg.sender);
    }

    /**
     * @dev Expire a benefit if past its expiration timestamp.
     */
    function checkAndExpire(bytes32 benefitId) public {
        Benefit storage b = benefits[benefitId];
        if (b.status == Status.Issued && block.timestamp > b.expiration) {
            b.status = Status.Expired;
        }
    }
}