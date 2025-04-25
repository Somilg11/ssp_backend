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
const auctionService_1 = require("../services/auctionService");
const client_1 = __importDefault(require("../prisma/client")); // assuming this is how you import prisma
jest.mock('../prisma/client', () => ({
    prisma: {
        dSP: {
            findMany: jest.fn(), // mock findMany function
        },
    },
}));
describe('Auction Service', () => {
    it('should return the correct winning bid', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        client_1.default.dSP.findMany.mockResolvedValue([
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
        const auctionResult = yield (0, auctionService_1.runAuction)({ geo: 'US', device: 'mobile' }); // assuming the auction logic calls findMany
        expect(auctionResult).toBeTruthy();
        expect((_a = auctionResult === null || auctionResult === void 0 ? void 0 : auctionResult.winner) === null || _a === void 0 ? void 0 : _a.name).toBe('DSP_A');
        expect(auctionResult === null || auctionResult === void 0 ? void 0 : auctionResult.winnerBid).toBe(3.5);
    }));
});
