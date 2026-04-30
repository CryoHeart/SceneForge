import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.savedEvent.deleteMany();
  await prisma.setlist.deleteMany();
  await prisma.poster.deleteMany();
  await prisma.eventBand.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.band.deleteMany();
  await prisma.venue.deleteMany();

  const [voidrite, steelThrone, neonRuin] = await Promise.all([
    prisma.band.create({
      data: {
        name: "Voidrite",
        bio: "Atmospheric doom with post-metal textures.",
        genres: ["doom", "post-metal"],
        city: "Seattle",
        imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee",
        socialLinks: {
          instagram: "https://instagram.com/voidrite",
          bandcamp: "https://voidrite.bandcamp.com",
        },
      },
    }),
    prisma.band.create({
      data: {
        name: "Steel Throne",
        bio: "Classic heavy riffs with modern groove energy.",
        genres: ["heavy metal", "groove"],
        city: "Portland",
        imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
        socialLinks: {
          spotify: "https://open.spotify.com",
          youtube: "https://youtube.com",
        },
      },
    }),
    prisma.band.create({
      data: {
        name: "Neon Ruin",
        bio: "Dark synth-rock crossing into blackened punk edges.",
        genres: ["synth-rock", "blackened punk"],
        city: "Seattle",
        imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
        socialLinks: {
          website: "https://neonruin.example.com",
        },
      },
    }),
  ]);

  const [cryptHall, ironCellar] = await Promise.all([
    prisma.venue.create({
      data: {
        name: "Crypt Hall",
        city: "Seattle",
        address: "119 Pike St",
        capacity: 420,
        description: "Charcoal interior room with premium sound and compact pit.",
      },
    }),
    prisma.venue.create({
      data: {
        name: "Iron Cellar",
        city: "Portland",
        address: "88 Burnside Ave",
        capacity: 280,
        description: "Basement venue known for raw underground showcases.",
      },
    }),
  ]);

  const eventA = await prisma.event.create({
    data: {
      title: "Black Steel Friday",
      city: "Seattle",
      genre: "metal",
      description: "Triple-headliner featuring doom, groove, and synth-rock crossover.",
      date: new Date("2026-06-12T20:00:00.000Z"),
      price: 28,
      ticketUrl: "https://tickets.example.com/black-steel-friday",
      venueId: cryptHall.id,
      bands: {
        create: [{ bandId: voidrite.id, slotTime: "20:30" }, { bandId: steelThrone.id, slotTime: "22:00" }],
      },
    },
  });

  const eventB = await prisma.event.create({
    data: {
      title: "Ruin Circuit",
      city: "Portland",
      genre: "rock",
      description: "Late-night industrial rock and underground metal set.",
      date: new Date("2026-06-21T21:00:00.000Z"),
      price: 20,
      ticketUrl: "https://tickets.example.com/ruin-circuit",
      venueId: ironCellar.id,
      bands: {
        create: [{ bandId: neonRuin.id, slotTime: "21:30" }, { bandId: steelThrone.id, slotTime: "23:00" }],
      },
    },
  });

  await prisma.poster.createMany({
    data: [
      {
        imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
        caption: "Black Steel Friday",
        eventId: eventA.id,
      },
      {
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
        caption: "Ruin Circuit",
        eventId: eventB.id,
      },
    ],
  });

  await prisma.setlist.createMany({
    data: [
      {
        eventId: eventA.id,
        bandId: voidrite.id,
        songs: ["Grave Echo", "Ashen Crown", "Nightglass"],
      },
      {
        eventId: eventA.id,
        bandId: steelThrone.id,
        songs: ["Iron Vein", "Fuelline", "Colossus"],
      },
      {
        eventId: eventB.id,
        bandId: neonRuin.id,
        songs: ["Mercury Lights", "Dead Satellite", "Signal Collapse"],
      },
    ],
  });

  const password = await bcrypt.hash("password123", 10);
  const fan = await prisma.user.create({
    data: {
      username: "fanuser",
      email: "fan@sceneforge.dev",
      password,
      role: "fan",
    },
  });

  await prisma.user.createMany({
    data: [
      {
        username: "bandboss",
        email: "band@sceneforge.dev",
        password,
        role: "band_admin",
        bandId: steelThrone.id,
      },
      {
        username: "venueboss",
        email: "venue@sceneforge.dev",
        password,
        role: "venue_admin",
        venueId: cryptHall.id,
      },
      {
        username: "sysadmin",
        email: "admin@sceneforge.dev",
        password,
        role: "admin",
      },
    ],
  });

  await prisma.savedEvent.create({
    data: {
      userId: fan.id,
      eventId: eventA.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
