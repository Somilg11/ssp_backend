import { runAuction } from '../services/auctionService';
import prisma from '../prisma/client'; // assuming this is how you import prisma

jest.mock('../prisma/client', () => ({
  prisma: {
    dSP: {
      findMany: jest.fn(), // mock findMany function
    },
  },
}));

describe('Auction Service', () => {
  it('should return the correct winning bid', async () => {
    (prisma.dSP.findMany as jest.Mock).mockResolvedValue([ // mock the return value of findMany
      {
        id: 'DSP_A',
        name: 'DSP_A',
        bidRules: [
          { geo: 'US', device: 'mobile', bidPrice: 3.5 }, // winning bid
        ],
        creatives: [{ imageUrl: 'https://example.com/ad-a.jpg', clickUrl: 'https://example.com/landing-a' }],
      },
      {
        id: 'DSP_B',
        name: 'DSP_B',
        bidRules: [
          { geo: 'US', device: 'mobile', bidPrice: 2.2 },
        ],
        creatives: [{ imageUrl: 'https://example.com/ad-b.jpg', clickUrl: 'https://example.com/landing-b' }],
      },
    ]);

    const auctionResult = await runAuction({ geo: 'US', device: 'mobile' }); // assuming the auction logic calls findMany

    expect(auctionResult).toBeTruthy();
    expect(auctionResult?.winner?.name).toBe('DSP_A');
    expect(auctionResult?.winnerBid).toBe(3.5);
  });
});
