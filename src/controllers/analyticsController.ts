import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { DSP } from '@prisma/client';


export const getAnalytics = async (_req: Request, res: Response) => {
  try {
    // Total number of ad requests
    const totalRequests = await prisma.adRequest.count();

    // Get all DSPs with their bids count (optimized query)
    const winRates = await prisma.dSP.findMany({
      include: {
        bids: true,
        _count: {
          select: {
            bids: true,
          },
        },
      },
    });

    // Calculate win rates and average CPM for each DSP
    // Inside map:
const data = await Promise.all(
  winRates.map(async (dsp: DSP & { bids: any[], _count: { bids: number } }) => {
    const wins = await prisma.adRequest.count({
      where: { winnerDspId: dsp.id },
    });

    const avgCPMResult = await prisma.bid.aggregate({
      where: { dspId: dsp.id },
      _avg: { bidPrice: true },
    });

    const winRate = (wins / (dsp._count.bids || 1)) * 100;
    const avgCPM = avgCPMResult._avg.bidPrice ?? 0;

    return {
      dsp: dsp.name,
      winRate: parseFloat(winRate.toFixed(2)),
      avgCPM: parseFloat(avgCPM.toFixed(2)),
    };
  })
);


    // Sending the response
    res.json({ totalRequests, dspStats: data });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
};
