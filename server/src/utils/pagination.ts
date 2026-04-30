export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta extends PaginationParams {
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const buildPagination = ({ page, limit }: PaginationParams) => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
};

export const buildPaginationMeta = ({
  page,
  limit,
  total,
}: PaginationParams & { total: number }): PaginationMeta => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};
