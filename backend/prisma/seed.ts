import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hotel = await prisma.hotel.upsert({
    where: { id: "seed-hotel-1" },
    update: {},
    create: {
      id: "seed-hotel-1",
      name: "Shivaji Military Hotel",
      ownerId: "seed-owner-1",
      status: "APPROVED",
    },
  });

  const branchMain = await prisma.branch.upsert({
    where: { id: "seed-branch-main" },
    update: {},
    create: {
      id: "seed-branch-main",
      hotelId: hotel.id,
      name: "Main Branch",
      address: "MG Road",
      maxQueue: 60,
    },
  });

  const branchAnnex = await prisma.branch.upsert({
    where: { id: "seed-branch-annex" },
    update: {},
    create: {
      id: "seed-branch-annex",
      hotelId: hotel.id,
      name: "Annex Branch",
      address: "Station Road",
      maxQueue: 30,
    },
  });

  await prisma.staffUser.upsert({
    where: { phone: "+919999900001" },
    update: {},
    create: {
      hotelId: hotel.id,
      branchId: branchMain.id,
      phone: "+919999900001",
      name: "Owner Staff",
      role: "OWNER",
    },
  });

  await prisma.staffUser.upsert({
    where: { phone: "+919999900002" },
    update: {},
    create: {
      hotelId: hotel.id,
      branchId: branchMain.id,
      phone: "+919999900002",
      name: "Host Staff",
      role: "HOST",
    },
  });

  console.log("Seed complete:", {
    hotel: hotel.name,
    branches: [branchMain.name, branchAnnex.name],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
