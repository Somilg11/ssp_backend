import prisma from '../prisma/client';
import { DSP, BidRule } from '@prisma/client'; // Import types

export const runAuction = async ({ geo, device }: { geo: string; device: string }) => {
  // Fetch DSPs that are active and have bid rules for the specific geo/device pair
  const dsps = await prisma.dSP.findMany({
    where: {
      isActive: true,
      targets: {
        some: {
          geo,
          device,
        },
      },
    },
    include: {
      bidRules: true,
      creatives: true,
    },
  });

  // Map over DSPs and filter valid bids based on geo/device criteria
  // ...same code above...

  // Map over DSPs and filter valid bids based on geo/device criteria
  const bids = dsps.map((dsp: DSP & { bidRules: BidRule[], creatives: any[] }) => {
    const rule = dsp.bidRules.find((r: BidRule) => r.geo === geo && r.device === device);
    if (rule) {
      return { dspId: dsp.id, dsp, bidPrice: parseFloat(rule.bidPrice.toString()) };
    }
    return null;
  }).filter(Boolean) as { dspId: string, dsp: any, bidPrice: number }[];

// ...rest stays same


  // If no valid bids are found, return null (no winner)
  if (!bids.length) return { message: 'No eligible DSPs responded.' };

  // Find the highest bid
  const winningBid = bids.reduce((max, b) => (b.bidPrice > max.bidPrice ? b : max), bids[0]);

  // Get the creative associated with the winning bid (first creative in the list)
  const creative = winningBid.dsp.creatives.length > 0 ? winningBid.dsp.creatives[0] : null;

  // Return the winner and their associated data
  return {
    winner: winningBid.dsp.name,  // Returning just the name for easier use in the frontend
    winnerBid: winningBid.bidPrice,
    creative,
    bids,  // You may return all bids for analytics or debugging
  };
};
