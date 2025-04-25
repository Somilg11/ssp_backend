-- CreateTable
CREATE TABLE "AdRequest" (
    "id" TEXT NOT NULL,
    "publisherId" TEXT NOT NULL,
    "adSlotId" TEXT NOT NULL,
    "geo" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "winnerDsp" TEXT NOT NULL,
    "winningBid" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AdRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "adRequestId" TEXT NOT NULL,
    "dspId" TEXT NOT NULL,
    "bidPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DSP" (
    "id" TEXT NOT NULL,
    "geo" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "bidPrice" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "clickUrl" TEXT NOT NULL,

    CONSTRAINT "DSP_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_adRequestId_fkey" FOREIGN KEY ("adRequestId") REFERENCES "AdRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
