import { prisma } from "../config/prisma.js";
import { buildPagination, buildPaginationMeta } from "../utils/pagination.js";

interface PosterListQuery {
  page: number;
  limit: number;
}

export const posterService = {
  async list(query: PosterListQuery) {
    const { skip, take } = buildPagination({ page: query.page, limit: query.limit });

    const [total, data] = await Promise.all([
      prisma.poster.count(),
      prisma.poster.findMany({
        include: { event: true },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);

    return {
      data,
      pagination: buildPaginationMeta({ page: query.page, limit: query.limit, total }),
    };
  },
};
