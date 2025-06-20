# Pilot Guide for Blockchain Welfare Delivery Platform

This guide walks non-technical stakeholders through the key workflows in the Admin, Beneficiary, and Vendor portals.

## 1. Admin Workflow

1. **Connect Wallet**: Open the Admin Portal and click _Connect Wallet_. Select your MetaMask account registered as the contract owner.

   ![Connect Wallet Screenshot](screenshots/admin_connect_wallet.png)

2. **Register Vendor**: Enter the vendor's wallet address and click _Add Vendor_. A toast notification confirms success.

   ![Add Vendor Screenshot](screenshots/admin_add_vendor.png)

3. **Issue Benefit**: Fill in recipient address, benefit type, value, and expiration date. Click _Issue Benefit_ to issue on-chain.

   ![Issue Benefit Screenshot](screenshots/admin_issue_benefit.png)

4. **View Benefits Table**: The DataTable updates in real time, showing all issued benefits with status, recipient, value, and expiration.

   ![Benefits Table Screenshot](screenshots/admin_benefits_table.png)

## 2. Beneficiary Workflow

1. **Connect Wallet**: Open the Beneficiary Portal and click _Connect Wallet_.

2. **View VCs**: Your mock Verifiable Credentials appear as digital wallet cards.

   ![VCs Screenshot](screenshots/beneficiary_vcs.png)

3. **View Benefits**: Issued benefits appear as cards showing value, expiration, and status badge.

   ![Benefit Cards Screenshot](screenshots/beneficiary_cards.png)

## 3. Vendor Workflow

1. **Connect Wallet**: Open the Vendor Portal and click _Connect Wallet_. Ensure your address is registered as a vendor.

2. **Redeem Benefit**: Enter beneficiary address and benefit code, then click _Redeem_. A loading spinner appears during processing.

   ![Redeem Form Screenshot](screenshots/vendor_redeem.png)

3. **View History**: The DataTable logs your redemption transactions with timestamp.

   ![Redemption History Screenshot](screenshots/vendor_history.png)

---

_Screenshots folder (`/screenshots/`) should contain the above images captured from the polished UI._