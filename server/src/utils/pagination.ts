import { AppError } from "./appError";

const MAX_LIMIT = 100;

export function parsePagination(page?: string, limit?: string) {
  const parsedPage = page ? Number(page) : 1;
  const parsedLimit = limit ? Number(limit) : 12;

  if (!Number.isInteger(parsedPage) || !Number.isInteger(parsedLimit) || parsedPage < 1 || parsedLimit < 1) {
    throw new AppError("Invalid pagination values", 400);
  }

  if (parsedLimit > MAX_LIMIT) {
    throw new AppError(`Limit cannot be greater than ${MAX_LIMIT}`, 400);
  }

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
}
