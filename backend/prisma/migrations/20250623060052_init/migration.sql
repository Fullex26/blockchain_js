-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Beneficiary', 'Vendor');

-- CreateEnum
CREATE TYPE "BenefitStatus" AS ENUM ('Issued', 'Redeemed', 'Expired');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "walletAddress" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benefit" (
    "id" SERIAL NOT NULL,
    "benefitId" TEXT NOT NULL,
    "recipientAddress" TEXT NOT NULL,
    "value" DECIMAL(30,0) NOT NULL,
    "status" "BenefitStatus" NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "redeemedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "issuedByAddress" TEXT NOT NULL,
    "redeemedByAddress" TEXT,

    CONSTRAINT "Benefit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_walletAddress_key" ON "Vendor"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Benefit_benefitId_key" ON "Benefit"("benefitId");
