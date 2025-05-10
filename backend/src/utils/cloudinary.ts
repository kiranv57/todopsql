import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadAndTransformImage = async (
    imagePath: string,
    uploadOptions: object = {}
  ): Promise<string> => {
    try {
      const uploadResult = await cloudinary.uploader.upload(imagePath, {
        ...uploadOptions,
      });
  
      return uploadResult.secure_url; // Return the Cloudinary URL
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };