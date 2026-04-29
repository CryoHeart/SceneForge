/**
 * Usage:
 *   node scripts/set-poster.cjs <eventId> <filename>
 *
 * Example:
 *   node scripts/set-poster.cjs 1 tel-aviv-riffstorm-festival.jpg
 *
 * The file must exist in server/public/posters/<filename>.
 * The imageUrl stored in the DB will be: http://localhost:5000/posters/<filename>
 */

const { PrismaClient } = require("@prisma/client");

const [, , eventIdArg, filename] = process.argv;

if (!eventIdArg || !filename) {
  console.error("Usage: node scripts/set-poster.cjs <eventId> <filename>");
  process.exit(1);
}

const eventId = Number(eventIdArg);
if (!Number.isInteger(eventId) || eventId < 1) {
  console.error("eventId must be a positive integer");
  process.exit(1);
}

const imageUrl = `http://localhost:5000/posters/${filename}`;
const prisma = new PrismaClient();

async function main() {
  await prisma.poster.upsert({
    where: { eventId },
    update: { imageUrl },
    create: { eventId, imageUrl },
  });
  console.log(`✓ Poster set for eventId=${eventId}: ${imageUrl}`);
}

main()
  .catch((err) => { console.error(err); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
