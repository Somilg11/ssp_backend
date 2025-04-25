"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const adRequest_1 = __importDefault(require("../routes/adRequest"));
const client_1 = __importDefault(require("../prisma/client"));
// Set up the app for testing
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/ad-request', adRequest_1.default);
// Mock the Prisma client
jest.mock('../prisma/client', () => ({
    dSP: {
        create: jest.fn(),
        findMany: jest.fn(), // Mock findMany properly
    },
}));
describe('POST /ad-request', () => {
    it('should return the winning DSP and creative', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockAdRequest = {
            publisher_id: '123',
            ad_slot_id: 'banner_top',
            geo: 'US',
            device: 'mobile',
            time: new Date().toISOString(),
        };
        // Mock findMany to return valid data
        client_1.default.dSP.findMany.mockResolvedValue([
            {
                id: '1',
                name: 'DSP_A',
                isActive: true,
                bidRules: [{ geo: 'US', device: 'mobile', bidPrice: 3.5 }],
                creatives: [{ imageUrl: 'https://example.com/ad-a.jpg', clickUrl: 'https://example.com/landing-a' }],
            },
        ]);
        // Mock create method (if needed)
        client_1.default.dSP.create.mockResolvedValue({
            id: '1',
            name: 'DSP_A',
            isActive: true,
            bidRules: [{ geo: 'US', device: 'mobile', bidPrice: 3.5 }],
            creatives: [{ imageUrl: 'https://example.com/ad-a.jpg', clickUrl: 'https://example.com/landing-a' }],
        });
        // Simulate the POST request
        const response = yield (0, supertest_1.default)(app)
            .post('/ad-request')
            .send(mockAdRequest);
        // Assert the response
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('winner_dsp', 'DSP_A');
        expect(response.body).toHaveProperty('bid_price', 3.5);
        expect(response.body.creative).toHaveProperty('image_url');
        expect(response.body.creative).toHaveProperty('click_url');
    }));
    it('should return an error if no eligible DSP responds', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockAdRequest = {
            publisher_id: '123',
            ad_slot_id: 'banner_top',
            geo: 'US',
            device: 'tablet', // No DSP targeting 'tablet'
            time: new Date().toISOString(),
        };
        // Mock findMany to return an empty array (no eligible DSPs)
        client_1.default.dSP.findMany.mockResolvedValue([]);
        // Simulate the POST request
        const response = yield (0, supertest_1.default)(app)
            .post('/ad-request')
            .send(mockAdRequest);
        // Assert the response
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('No eligible DSPs responded.');
    }));
});
