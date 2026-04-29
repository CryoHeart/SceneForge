const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const imageUrl =
  "https://chatgpt.com/backend-api/estuary/content?id=file_000000002b5471f4bd8281b3e6b3092d&ts=493741&p=fs&cid=1&sig=10fb47450436db5d09d80152b7f2bdfacdc13fa439cdae4d4d6d8da7d668e6e6&v=0";

async function main() {
  await prisma.poster.upsert({
    where: { eventId: 1 },
    update: { imageUrl },
    create: { eventId: 1, imageUrl },
  });

  console.log("Poster updated for eventId=1");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
