import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user (update email to match your Supabase auth user)
  const admin = await prisma.user.upsert({
    where: { email: "admin@cherish.app" },
    update: {},
    create: {
      email: "admin@cherish.app",
      name: "Cherish Admin",
      role: "ADMIN",
      tier: "PRO_MONTHLY",
      onboarded: true,
      memoryBooks: {
        create: {
          title: "Admin Demo Book",
          isDefault: true,
          coverColor: "#c84820",
        },
      },
    },
  });
  console.log(`  ✓ Admin user: ${admin.email}`);

  // Create sample scrapbook templates
  const templateData = [
    { name: "Beach Vacation", category: "vacation", isPremium: false },
    { name: "Birthday Party", category: "birthday", isPremium: false },
    { name: "Holiday Season", category: "holiday", isPremium: false },
    { name: "Baby's First Year", category: "baby", isPremium: true },
    { name: "Wedding Day", category: "wedding", isPremium: true },
    { name: "Everyday Moments", category: "everyday", isPremium: false },
    { name: "Road Trip Adventure", category: "vacation", isPremium: false },
    { name: "Family Reunion", category: "everyday", isPremium: false },
    { name: "Graduation Day", category: "birthday", isPremium: true },
    { name: "New Year Memories", category: "holiday", isPremium: false },
  ];

  for (const t of templateData) {
    await prisma.scrapbookTemplate.create({
      data: {
        ...t,
        canvasData: {
          elements: [],
          bgColor: "#ffffff",
          layout: "grid-2x2",
        },
      },
    });
  }
  console.log(`  ✓ ${templateData.length} scrapbook templates created`);

  // Create sample sticker packs
  const packData = [
    {
      name: "Travel Essentials",
      category: "travel",
      isPremium: false,
      stickers: [
        "airplane", "beach", "camera", "compass", "luggage",
        "map", "mountain", "palm-tree", "passport", "sunset",
      ],
    },
    {
      name: "Celebrations",
      category: "holiday",
      isPremium: false,
      stickers: [
        "balloon", "cake", "confetti", "gift", "party-hat",
        "sparkler", "star", "trophy", "crown", "fireworks",
      ],
    },
    {
      name: "Baby Milestones",
      category: "baby",
      isPremium: true,
      stickers: [
        "bottle", "footprint", "heart", "moon", "onesie",
        "pacifier", "rattle", "stork", "teddy-bear", "blocks",
      ],
    },
    {
      name: "Seasonal Collection",
      category: "seasonal",
      isPremium: true,
      stickers: [
        "autumn-leaf", "snowflake", "flower", "sun",
        "pumpkin", "candy-cane", "bunny", "shamrock",
      ],
    },
  ];

  for (const pack of packData) {
    const createdPack = await prisma.stickerPack.create({
      data: {
        name: pack.name,
        category: pack.category,
        isPremium: pack.isPremium,
      },
    });

    for (const sticker of pack.stickers) {
      await prisma.sticker.create({
        data: {
          packId: createdPack.id,
          name: sticker,
          url: `/stickers/${pack.category}/${sticker}.svg`,
          category: pack.category,
        },
      });
    }
  }
  console.log(`  ✓ ${packData.length} sticker packs created`);

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
