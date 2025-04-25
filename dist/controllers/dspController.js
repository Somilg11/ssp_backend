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
exports.createDSP = exports.getDSPs = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const getDSPs = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dsps = yield client_1.default.dSP.findMany({
            include: {
                bidRules: true,
                creatives: true,
                targets: true,
            },
        });
        res.json(dsps);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch DSPs' });
    }
});
exports.getDSPs = getDSPs;
const createDSP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, isActive, bidRules = [], creatives = [] } = req.body;
    // Ensure all required fields are provided
    if (!name || !isActive || !Array.isArray(bidRules) || !Array.isArray(creatives)) {
        res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        // Create the new DSP
        const dsp = yield client_1.default.dSP.create({
            data: {
                name,
                isActive,
                bidRules: {
                    create: bidRules.map((rule) => ({
                        geo: rule.geo,
                        device: rule.device,
                        bidPrice: parseFloat(rule.bidPrice), // Ensure bidPrice is stored as a number
                    })),
                },
                creatives: {
                    create: creatives.map((creative) => ({
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
    }
    catch (err) {
        console.error('Error creating DSP:', err);
        res.status(500).json({ error: 'Failed to create DSP' });
    }
});
exports.createDSP = createDSP;
