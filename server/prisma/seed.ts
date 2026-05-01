import bcrypt from "bcrypt";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.savedEvent.deleteMany();
  await prisma.setlist.deleteMany();
  await prisma.poster.deleteMany();
  await prisma.event.deleteMany();
  await prisma.band.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.user.deleteMany();

  await Promise.all([
    prisma.userType.upsert({
      where: { code: "USER" },
      update: {},
      create: { code: "USER" },
    }),
    prisma.userType.upsert({
      where: { code: "BAND_ADMIN" },
      update: {},
      create: { code: "BAND_ADMIN" },
    }),
    prisma.userType.upsert({
      where: { code: "VENUE_ADMIN" },
      update: {},
      create: { code: "VENUE_ADMIN" },
    }),
    prisma.userType.upsert({
      where: { code: "ADMIN" },
      update: {},
      create: { code: "ADMIN" },
    }),
  ]);

  const adminPass = await bcrypt.hash("password123", 10);
  const fanPass = await bcrypt.hash("fanpass123", 10);

  const [adminUser, fanUser] = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@sceneforge.dev",
        passwordHash: adminPass,
        displayName: "Scene Admin",
        role: UserRole.admin,
        userType: { connect: { code: "ADMIN" } },
        city: "Istanbul",
      },
    }),
    prisma.user.create({
      data: {
        email: "fan@sceneforge.dev",
        passwordHash: fanPass,
        displayName: "Riff Hunter",
        role: UserRole.fan,
        userType: { connect: { code: "USER" } },
        city: "Istanbul",
      },
    }),
  ]);

  const [bandOne, bandTwo, bandThree] = await Promise.all([
    prisma.band.create({
      data: {
        name: "Iron Veil",
        slug: "iron-veil",
        bio: "Progressive doom with razor-sharp harmonies.",
        city: "Istanbul",
        genreTags: "doom,progressive,metal",
        linksJson: {
          instagram: "https://instagram.com/ironveil",
          spotify: "https://spotify.com/ironveil",
        },
      },
    }),
    prisma.band.create({
      data: {
        name: "Neon Requiem",
        slug: "neon-requiem",
        bio: "Post-metal textures and cinematic breakdowns.",
        city: "Ankara",
        genreTags: "post-metal,alternative,rock",
        linksJson: {
          bandcamp: "https://neonrequiem.bandcamp.com",
        },
      },
    }),
    prisma.band.create({
      data: {
        name: "Black Harbor",
        slug: "black-harbor",
        bio: "Groove-heavy modern metal from the coast.",
        city: "Izmir",
        genreTags: "groove,metalcore,metal",
      },
    }),
  ]);

  const [venueOne, venueTwo] = await Promise.all([
    prisma.venue.create({
      data: {
        name: "Forge Room",
        slug: "forge-room",
        description: "Underground basement with premium sound.",
        address: "Kadikoy District 41",
        city: "Istanbul",
        capacity: 280,
      },
    }),
    prisma.venue.create({
      data: {
        name: "Crimson Stage",
        slug: "crimson-stage",
        description: "Industrial warehouse venue for heavy nights.",
        address: "Cankaya District 12",
        city: "Ankara",
        capacity: 420,
      },
    }),
  ]);

  const eventOne = await prisma.event.create({
    data: {
      title: "Steel Ritual Night",
      slug: "steel-ritual-night",
      description: "Three-band showcase featuring rising local legends.",
      city: "Istanbul",
      genre: "Metal",
      startsAt: new Date("2026-06-12T19:30:00.000Z"),
      price: 18.5,
      ticketUrl: "https://tickets.sceneforge.dev/steel-ritual-night",
      venueId: venueOne.id,
      createdById: adminUser.id,
      bands: {
        connect: [{ id: bandOne.id }, { id: bandThree.id }],
      },
    },
    include: { bands: true },
  });

  const eventTwo = await prisma.event.create({
    data: {
      title: "Midnight Feedback",
      slug: "midnight-feedback",
      description: "Late-night post-metal and alt-rock fusion event.",
      city: "Ankara",
      genre: "Post-Metal",
      startsAt: new Date("2026-06-22T20:00:00.000Z"),
      price: 14,
      ticketUrl: "https://tickets.sceneforge.dev/midnight-feedback",
      venueId: venueTwo.id,
      createdById: adminUser.id,
      bands: {
        connect: [{ id: bandTwo.id }],
      },
    },
  });

  await prisma.poster.createMany({
    data: [
      {
        imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee",
        cloudinaryId: "mock/steel-ritual-night",
        eventId: eventOne.id,
        uploadedById: adminUser.id,
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491",
        cloudinaryId: "mock/midnight-feedback",
        eventId: eventTwo.id,
        uploadedById: adminUser.id,
      },
    ],
  });

  await prisma.setlist.createMany({
    data: [
      {
        eventId: eventOne.id,
        bandId: bandOne.id,
        songsJson: ["Ash Crown", "Veins of Iron", "Terminal Hymn"],
      },
      {
        eventId: eventOne.id,
        bandId: bandThree.id,
        songsJson: ["Riot Tide", "Loose Teeth", "Harborfall"],
      },
      {
        eventId: eventTwo.id,
        bandId: bandTwo.id,
        songsJson: ["Mirrors", "Burning Neon", "Oath in Static"],
      },
    ],
  });

  await prisma.savedEvent.create({
    data: {
      userId: fanUser.id,
      eventId: eventOne.id,
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
