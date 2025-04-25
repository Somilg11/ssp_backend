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
exports.runAuction = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const runAuction = (_a) => __awaiter(void 0, [_a], void 0, function* ({ geo, device }) {
    // Fetch DSPs that are active and have bid rules for the specific geo/device pair
    const dsps = yield client_1.default.dSP.findMany({
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
    const bids = dsps.map((dsp) => {
        const rule = dsp.bidRules.find((r) => r.geo === geo && r.device === device);
        if (rule) {
            return { dspId: dsp.id, dsp, bidPrice: parseFloat(rule.bidPrice.toString()) };
        }
        return null;
    }).filter(Boolean);
    // If no valid bids are found, return null (no winner)
    if (!bids.length)
        return { message: 'No eligible DSPs responded.' };
    // Find the highest bid
    const winningBid = bids.reduce((max, b) => (b.bidPrice > max.bidPrice ? b : max), bids[0]);
    // Get the creative associated with the winning bid (first creative in the list)
    const creative = winningBid.dsp.creatives.length > 0 ? winningBid.dsp.creatives[0] : null;
    // Return the winner and their associated data
    return {
        winner: winningBid.dsp.name, // Returning just the name for easier use in the frontend
        winnerBid: winningBid.bidPrice,
        creative,
        bids, // You may return all bids for analytics or debugging
    };
});
exports.runAuction = runAuction;
