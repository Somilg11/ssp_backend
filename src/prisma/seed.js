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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // DSP A
        const dspA = yield prisma.dSP.create({
            data: {
                name: 'DSP_A',
                isActive: true,
                creatives: {
                    create: {
                        imageUrl: 'https://example.com/ad-a.jpg',
                        clickUrl: 'https://example.com/landing-a',
                    },
                },
                targets: {
                    create: {
                        geo: 'US',
                        device: 'mobile',
                    },
                },
                bidRules: {
                    create: {
                        geo: 'US',
                        device: 'mobile',
                        bidPrice: 3.5,
                    },
                },
            },
        });
        // DSP B
        const dspB = yield prisma.dSP.create({
            data: {
                name: 'DSP_B',
                isActive: true,
                creatives: {
                    create: {
                        imageUrl: 'https://example.com/ad-b.jpg',
                        clickUrl: 'https://example.com/landing-b',
                    },
                },
                targets: {
                    create: {
                        geo: 'US',
                        device: 'desktop',
                    },
                },
                bidRules: {
                    create: {
                        geo: 'US',
                        device: 'desktop',
                        bidPrice: 2.2,
                    },
                },
            },
        });
        // DSP C
        const dspC = yield prisma.dSP.create({
            data: {
                name: 'DSP_C',
                isActive: true,
                creatives: {
                    create: {
                        imageUrl: 'https://example.com/ad-c.jpg',
                        clickUrl: 'https://example.com/landing-c',
                    },
                },
                targets: {
                    create: {
                        geo: 'IN',
                        device: 'mobile',
                    },
                },
                bidRules: {
                    create: {
                        geo: 'IN',
                        device: 'mobile',
                        bidPrice: 1.5,
                    },
                },
            },
        });
        console.log('✅ DSPs seeded!');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => {
    prisma.$disconnect();
});
