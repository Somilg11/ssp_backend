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
exports.getAnalytics = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const getAnalytics = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Total number of ad requests
        const totalRequests = yield client_1.default.adRequest.count();
        // Get all DSPs with their bids count (optimized query)
        const winRates = yield client_1.default.dSP.findMany({
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
        const data = yield Promise.all(winRates.map((dsp) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Count how many times each DSP was the winner
            const wins = yield client_1.default.adRequest.count({
                where: {
                    winnerDspId: dsp.id,
                },
            });
            // Calculate the average CPM for each DSP
            const avgCPMResult = yield client_1.default.bid.aggregate({
                where: {
                    dspId: dsp.id,
                },
                _avg: {
                    bidPrice: true,
                },
            });
            // Calculate win rate and set average CPM to 0 if no bids exist
            const winRate = (wins / (dsp._count.bids || 1)) * 100;
            const avgCPM = (_a = avgCPMResult._avg.bidPrice) !== null && _a !== void 0 ? _a : 0;
            return {
                dsp: dsp.name,
                winRate: parseFloat(winRate.toFixed(2)), // Formatting to 2 decimal places
                avgCPM: parseFloat(avgCPM.toFixed(2)), // Formatting to 2 decimal places
            };
        })));
        // Sending the response
        res.json({ totalRequests, dspStats: data });
    }
    catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ error: 'Failed to load analytics' });
    }
});
exports.getAnalytics = getAnalytics;
