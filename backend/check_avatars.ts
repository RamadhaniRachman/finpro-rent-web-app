import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const bookings = await prisma.booking.findMany({
    orderBy: { created_at: "desc" },
    take: 3,
    include: {
      users: true,
    },
  });

  console.log("Recent Bookings Users:");
  for (const b of bookings) {
    console.log(`User ID: ${b.users?.id}`);
    console.log(`Name: ${b.users?.name}`);
    console.log(`Avatar URL: ${b.users?.avatar_url}`);
    console.log('---');
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
