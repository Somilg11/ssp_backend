// controllers/adRequestController.ts
import { Request, Response } from 'express';
import { runAuction } from '../services/auctionService';
import prisma from '../prisma/client';

export const handleAdRequest = async (req: Request, res: Response): Promise<void> => {
  const { publisher_id, ad_slot_id, geo, device, time } = req.body;

  try {
    const auctionResult = await runAuction({ geo, device });

    await prisma.adRequest.create({
      data: {
        publisherId: publisher_id,
        adSlotId: ad_slot_id,
        geo,
        device,
        time: new Date(time),
        winnerDspId: auctionResult?.winner?.id ?? null,
        winningBid: auctionResult?.winnerBid ?? null,
        bids: {
          create: (auctionResult?.bids ?? []).map((b) => ({
            dspId: b.dspId,
            bidPrice: b.bidPrice,
          })),
        },
      },
    });

    if (!auctionResult?.winner) {
      res.json({ message: 'No eligible DSPs responded.' });
      return;
    }

    res.json({
      winner_dsp: auctionResult.winner.name,
      bid_price: auctionResult.winnerBid,
      creative: auctionResult.creative,
    });
  } catch (error) {
    console.error('Ad Request Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
