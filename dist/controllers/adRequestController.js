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
exports.handleAdRequest = void 0;
const auctionService_1 = require("../services/auctionService");
const client_1 = __importDefault(require("../prisma/client"));
const handleAdRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { publisher_id, ad_slot_id, geo, device, time } = req.body;
    try {
        const auctionResult = yield (0, auctionService_1.runAuction)({ geo, device });
        yield client_1.default.adRequest.create({
            data: {
                publisherId: publisher_id,
                adSlotId: ad_slot_id,
                geo,
                device,
                time: new Date(time),
                winnerDspId: (_b = (_a = auctionResult === null || auctionResult === void 0 ? void 0 : auctionResult.winner) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                winningBid: (_c = auctionResult === null || auctionResult === void 0 ? void 0 : auctionResult.winnerBid) !== null && _c !== void 0 ? _c : null,
                bids: {
                    create: ((_d = auctionResult === null || auctionResult === void 0 ? void 0 : auctionResult.bids) !== null && _d !== void 0 ? _d : []).map((b) => ({
                        dspId: b.dspId,
                        bidPrice: b.bidPrice,
                    })),
                },
            },
        });
        if (!(auctionResult === null || auctionResult === void 0 ? void 0 : auctionResult.winner)) {
            res.json({ message: 'No eligible DSPs responded.' });
            return;
        }
        res.json({
            winner_dsp: auctionResult.winner.name,
            bid_price: auctionResult.winnerBid,
            creative: auctionResult.creative,
        });
    }
    catch (error) {
        console.error('Ad Request Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.handleAdRequest = handleAdRequest;
