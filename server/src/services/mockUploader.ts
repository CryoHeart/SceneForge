interface UploadResult {
  secureUrl: string;
  provider: "mock-cloudinary";
}

export const uploadPosterMock = async (fileName: string): Promise<UploadResult> => {
  const sanitized = fileName.replace(/\s+/g, "-").toLowerCase();
  return {
    secureUrl: `https://mock-cloudinary.sceneforge.local/posters/${Date.now()}-${sanitized}`,
    provider: "mock-cloudinary",
  };
};
