const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('WelfareBenefit', function () {
  let WelfareBenefit;
  let welfare;
  let owner;
  let beneficiary;
  let vendor;

  beforeEach(async function () {
    [owner, beneficiary, vendor, other] = await ethers.getSigners();
    WelfareBenefit = await ethers.getContractFactory('WelfareBenefit');
    welfare = await WelfareBenefit.deploy();
    await welfare.deployed();
  });

  it('sets deployer as owner', async function () {
    expect(await welfare.owner()).to.equal(owner.address);
  });

  it('only owner can issueBenefit', async function () {
    const benefitId = ethers.utils.formatBytes32String('B1');
    const now = (await ethers.provider.getBlock('latest')).timestamp;
    await expect(
      welfare.connect(beneficiary).issueBenefit(beneficiary.address, benefitId, 100, now + 1000)
    ).to.be.revertedWith('Only admin can call this');
  });

  it('owner can issue and vendor can redeem', async function () {
    const benefitId = ethers.utils.formatBytes32String('B2');
    const now = (await ethers.provider.getBlock('latest')).timestamp;
    await welfare.issueBenefit(beneficiary.address, benefitId, 50, now + 1000);
    await welfare.addVendor(vendor.address);
    await expect(
      welfare.connect(vendor).redeemBenefit(benefitId, beneficiary.address)
    )
      .to.emit(welfare, 'BenefitRedeemed')
      .withArgs(benefitId, beneficiary.address, vendor.address);
  });

  it('cannot redeem twice', async function () {
    const benefitId = ethers.utils.formatBytes32String('B3');
    const now = (await ethers.provider.getBlock('latest')).timestamp;
    await welfare.issueBenefit(beneficiary.address, benefitId, 10, now + 1000);
    await welfare.addVendor(vendor.address);
    await welfare.connect(vendor).redeemBenefit(benefitId, beneficiary.address);
    await expect(
      welfare.connect(vendor).redeemBenefit(benefitId, beneficiary.address)
    ).to.be.revertedWith('Benefit not available for redemption');
  });

  it('cannot redeem expired benefit', async function () {
    const benefitId = ethers.utils.formatBytes32String('B4');
    const now = (await ethers.provider.getBlock('latest')).timestamp;
    await welfare.issueBenefit(beneficiary.address, benefitId, 10, now - 10);
    await welfare.addVendor(vendor.address);
    await expect(
      welfare.connect(vendor).redeemBenefit(benefitId, beneficiary.address)
    ).to.be.revertedWith('Benefit expired');
  });

  it('only vendor can call redeemBenefit', async function () {
    const benefitId = ethers.utils.formatBytes32String('B5');
    const now = (await ethers.provider.getBlock('latest')).timestamp;
    await welfare.issueBenefit(beneficiary.address, benefitId, 20, now + 1000);
    await expect(
      welfare.connect(other).redeemBenefit(benefitId, beneficiary.address)
    ).to.be.revertedWith('Only registered vendor can call this');
  });
});