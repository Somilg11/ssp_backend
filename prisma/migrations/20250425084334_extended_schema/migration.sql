/*
  Warnings:

  - You are about to drop the column `winnerDsp` on the `AdRequest` table. All the data in the column will be lost.
  - You are about to drop the column `bidPrice` on the `DSP` table. All the data in the column will be lost.
  - You are about to drop the column `clickUrl` on the `DSP` table. All the data in the column will be lost.
  - You are about to drop the column `device` on the `DSP` table. All the data in the column will be lost.
  - You are about to drop the column `geo` on the `DSP` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `DSP` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdRequest" DROP COLUMN "winnerDsp",
ADD COLUMN     "winnerDspId" TEXT,
ALTER COLUMN "winningBid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "DSP" DROP COLUMN "bidPrice",
DROP COLUMN "clickUrl",
DROP COLUMN "device",
DROP COLUMN "geo",
DROP COLUMN "imageUrl",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "BidRule" (
    "id" TEXT NOT NULL,
    "dspId" TEXT NOT NULL,
    "geo" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "bidPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BidRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creative" (
    "id" TEXT NOT NULL,
    "dspId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "clickUrl" TEXT NOT NULL,

    CONSTRAINT "Creative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Targeting" (
    "id" TEXT NOT NULL,
    "dspId" TEXT NOT NULL,
    "geo" TEXT NOT NULL,
    "device" TEXT NOT NULL,

    CONSTRAINT "Targeting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdRequest" ADD CONSTRAINT "AdRequest_winnerDspId_fkey" FOREIGN KEY ("winnerDspId") REFERENCES "DSP"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "DSP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidRule" ADD CONSTRAINT "BidRule_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "DSP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creative" ADD CONSTRAINT "Creative_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "DSP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Targeting" ADD CONSTRAINT "Targeting_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "DSP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
