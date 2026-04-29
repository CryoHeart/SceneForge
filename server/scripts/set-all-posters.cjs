const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const BASE_URL = "http://localhost:5000/posters";

const posters = [
  { eventId: 1, filename: "tel-aviv-riffstorm-festival.jpg" },
  { eventId: 2, filename: "haifa-northern-blast.jpg" },
  { eventId: 3, filename: "symphonic-metal-ceremony.jpg" },
  { eventId: 4, filename: "underground-groove-attack.jpg" },
  { eventId: 5, filename: "oriental-metal-eclipse.jpg" },
  { eventId: 6, filename: "doom-over-jaffa.jpg" },
  { eventId: 7, filename: "modern-metal-showcase.jpg" },
  { eventId: 8, filename: "blackened-winter-night.jpg" },
  { eventId: 9, filename: "progressive-winter-gathering.jpg" },
  { eventId: 10, filename: "new-year-metal-mass.jpg" },
  { eventId: 11, filename: "modern-core-collision.jpg" },
  { eventId: 12, filename: "hardcore-tel-aviv-uprising.jpg" },
  { eventId: 13, filename: "alt-metal-horizons.jpg" },
  { eventId: 14, filename: "submasq-world-metal-night.jpg" },
  { eventId: 15, filename: "punk-rock-riot-night.jpg" },
];

async function main() {
  for (const { eventId, filename } of posters) {
    const imageUrl = `${BASE_URL}/${filename}`;
    await prisma.poster.upsert({
      where: { eventId },
      update: { imageUrl },
      create: { eventId, imageUrl },
    });
    console.log(`✓ eventId=${eventId}  ${filename}`);
  }
}

main()
  .catch((err) => { console.error(err); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
