export type MockUploadResult = {
  secureUrl: string;
  cloudinaryId: string;
};

export async function mockCloudinaryUpload(fileName: string): Promise<MockUploadResult> {
  const safeName = fileName.replace(/\s+/g, "-").toLowerCase();
  return {
    secureUrl: `https://res.cloudinary.com/demo/image/upload/${safeName}`,
    cloudinaryId: `mock/${safeName}`,
  };
}
