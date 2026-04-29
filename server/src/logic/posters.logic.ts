import { countPosters, findPosters, upsertPoster } from "../dao/posters.dao";
import { PostersQuery, UploadPosterInput } from "../types/api";
import { AppError } from "../utils/appError";
import { mockCloudinaryUpload } from "../utils/mockUpload";
import { parsePagination } from "../utils/pagination";

export async function getPosters(query: PostersQuery) {
  const { page, limit, skip } = parsePagination(query.page, query.limit);
  const [data, total] = await Promise.all([
    findPosters({ skip, take: limit }),
    countPosters(),
  ]);

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

export async function uploadPoster(input: UploadPosterInput, userId?: number) {
  const eventId = Number(input.eventId);
  const fileName = input.fileName?.trim();

  if (!Number.isInteger(eventId) || eventId < 1 || !fileName) {
    throw new AppError("eventId and fileName are required", 400);
  }

  const uploadResult = await mockCloudinaryUpload(fileName);
  return upsertPoster({
    eventId,
    imageUrl: uploadResult.secureUrl,
    cloudinaryId: uploadResult.cloudinaryId,
    uploadedById: userId,
  });
}
