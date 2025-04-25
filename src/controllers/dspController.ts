import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getDSPs = async (_req: Request, res: Response) => {
  try {
    const dsps = await prisma.dSP.findMany({
      include: {
        bidRules: true,
        creatives: true,
        targets: true,
      },
    });
    res.json(dsps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch DSPs' });
  }
};

export const createDSP = async (req: Request, res: Response): Promise<void> => {
  const { name, isActive, bidRules = [], creatives = [] } = req.body;

  // Ensure all required fields are provided
  if (!name || !isActive || !Array.isArray(bidRules) || !Array.isArray(creatives)) {
    res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create the new DSP
    const dsp = await prisma.dSP.create({
      data: {
        name,
        isActive,
        bidRules: {
          create: bidRules.map((rule: { geo: string; device: string; bidPrice: string }) => ({
            geo: rule.geo,
            device: rule.device,
            bidPrice: parseFloat(rule.bidPrice), // Ensure bidPrice is stored as a number
          })),
        },
        creatives: {
          create: creatives.map((creative: { imageUrl: string; clickUrl: string }) => ({
            imageUrl: creative.imageUrl,
            clickUrl: creative.clickUrl,
          })),
        },
      },
      include: {
        bidRules: true,
        creatives: true,
      },
    });

    // Respond with the created DSP along with related records
    res.status(201).json(dsp);
  } catch (err) {
    console.error('Error creating DSP:', err);
    res.status(500).json({ error: 'Failed to create DSP' });
  }
};
