import { countBands, findAllBandsLight, findBandByAdminId, findBandById, findBands, updateBand } from "../dao/bands.dao";
import { BandsQuery } from "../types/api";
import { AppError } from "../utils/appError";
import { parsePagination } from "../utils/pagination";

export async function getBands(query: BandsQuery) {
  const { page, limit, skip } = parsePagination(query.page, query.limit);

  const filters = {
    q: query.q?.trim(),
    genre: query.genre?.trim(),
    skip,
    take: limit,
  };

  const [data, total] = await Promise.all([findBands(filters), countBands(filters)]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getBandById(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError("Invalid band id", 400);
  }

  const band = await findBandById(id);
  if (!band) {
    throw new AppError("Band not found", 404);
  }

  return band;
}

export async function getMyBand(adminId: number) {
  const band = await findBandByAdminId(adminId);
  if (!band) {
    throw new AppError("No band associated with your account", 404);
  }
  return band;
}

export async function getManagedBands(userId: number, isAdmin: boolean) {
  if (isAdmin) {
    return findAllBandsLight();
  }
  const band = await findBandByAdminId(userId);
  return band ? [band] : [];
}

export async function updateBandProfile(
  bandIdParam: string,
  userId: number,
  isAdmin: boolean,
  body: Record<string, unknown>,
) {
  const bandId = Number(bandIdParam);
  if (!Number.isInteger(bandId) || bandId < 1) {
    throw new AppError("Invalid band id", 400);
  }

  if (!isAdmin) {
    const owned = await findBandByAdminId(userId);
    if (!owned || owned.id !== bandId) {
      throw new AppError("Forbidden", 403);
    }
  }

  const name = typeof body.name === "string" ? body.name.trim() || undefined : undefined;
  const bio = typeof body.bio === "string" ? body.bio.trim() || undefined : undefined;
  const city = typeof body.city === "string" ? body.city.trim() || undefined : undefined;
  const genreTags = typeof body.genreTags === "string" ? body.genreTags.trim() || undefined : undefined;
  const linksJson =
    body.linksJson && typeof body.linksJson === "object" && !Array.isArray(body.linksJson)
      ? (body.linksJson as Record<string, string>)
      : undefined;

  return updateBand(bandId, { name, bio, city, genreTags, linksJson });
}
