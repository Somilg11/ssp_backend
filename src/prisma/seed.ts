import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // DSP A
  const dspA = await prisma.dSP.create({
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
  const dspB = await prisma.dSP.create({
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
  const dspC = await prisma.dSP.create({
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
