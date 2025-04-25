import request from 'supertest';
import express from 'express';
import adRequestRoutes from '../routes/adRequest';
import prisma from '../prisma/client';

// Set up the app for testing
const app = express();
app.use(express.json());
app.use('/ad-request', adRequestRoutes);

// Mock the Prisma client
jest.mock('../prisma/client', () => ({
  dSP: {
    create: jest.fn(),
    findMany: jest.fn(), // Mock findMany properly
  },
}));

describe('POST /ad-request', () => {
  it('should return the winning DSP and creative', async () => {
    const mockAdRequest = {
      publisher_id: '123',
      ad_slot_id: 'banner_top',
      geo: 'US',
      device: 'mobile',
      time: new Date().toISOString(),
    };

    // Mock findMany to return valid data
    (prisma.dSP.findMany as jest.Mock).mockResolvedValue([
      {
        id: '1',
        name: 'DSP_A',
        isActive: true,
        bidRules: [{ geo: 'US', device: 'mobile', bidPrice: 3.5 }],
        creatives: [{ imageUrl: 'https://example.com/ad-a.jpg', clickUrl: 'https://example.com/landing-a' }],
      },
    ]);

    // Mock create method (if needed)
    (prisma.dSP.create as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'DSP_A',
      isActive: true,
      bidRules: [{ geo: 'US', device: 'mobile', bidPrice: 3.5 }],
      creatives: [{ imageUrl: 'https://example.com/ad-a.jpg', clickUrl: 'https://example.com/landing-a' }],
    });

    // Simulate the POST request
    const response = await request(app)
      .post('/ad-request')
      .send(mockAdRequest);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('winner_dsp', 'DSP_A');
    expect(response.body).toHaveProperty('bid_price', 3.5);
    expect(response.body.creative).toHaveProperty('image_url');
    expect(response.body.creative).toHaveProperty('click_url');
  });

  it('should return an error if no eligible DSP responds', async () => {
    const mockAdRequest = {
      publisher_id: '123',
      ad_slot_id: 'banner_top',
      geo: 'US',
      device: 'tablet', // No DSP targeting 'tablet'
      time: new Date().toISOString(),
    };

    // Mock findMany to return an empty array (no eligible DSPs)
    (prisma.dSP.findMany as jest.Mock).mockResolvedValue([]);

    // Simulate the POST request
    const response = await request(app)
      .post('/ad-request')
      .send(mockAdRequest);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('No eligible DSPs responded.');
  });
});
