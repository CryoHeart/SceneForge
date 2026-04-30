import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";
import { buildPaginationMeta } from "../utils/pagination.js";

interface BandListQuery {
  page: number;
  limit: number;
  q?: string;
  genre?: string;
}

export const bandService = {
  async list(query: BandListQuery) {
    const baseWhere = {
      name: query.q ? { contains: query.q } : undefined,
    };

    if (!query.genre) {
      const skip = (query.page - 1) * query.limit;
      const [total, data] = await Promise.all([
        prisma.band.count({ where: baseWhere }),
        prisma.band.findMany({
          where: baseWhere,
          orderBy: { name: "asc" },
          skip,
          take: query.limit,
        }),
      ]);

      return {
        data,
        pagination: buildPaginationMeta({ page: query.page, limit: query.limit, total }),
      };
    }

    const all = await prisma.band.findMany({
      where: baseWhere,
      orderBy: { name: "asc" },
    });

    const filtered = all.filter((band) =>
      ((band.genres as string[]) ?? []).some((item) =>
        item.toLowerCase().includes(query.genre!.toLowerCase()),
      ),
    );

    const start = (query.page - 1) * query.limit;
    const data = filtered.slice(start, start + query.limit);

    return {
      data,
      pagination: buildPaginationMeta({
        page: query.page,
        limit: query.limit,
        total: filtered.length,
      }),
    };
  },

  async getById(id: string) {
    const band = await prisma.band.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!band) {
      throw new AppError(404, "Band not found", "BAND_NOT_FOUND");
    }

    return band;
  },
};
