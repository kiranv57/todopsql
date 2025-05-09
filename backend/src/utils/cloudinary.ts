import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary and return a transformed URL
 * @param {string} imagePath - The URL or local path of the image to upload
 * @param {object} uploadOptions - Options for the upload (e.g., public_id, folder)
 * @param {object} transformOptions - Options for the transformation (e.g., width, height, crop)
 * @returns {Promise<string>} - The transformed image URL
 */
export const uploadAndTransformImage = async (
  imagePath: string,
  uploadOptions: object = {},
  transformOptions: object = {}
): Promise<string> => {
  try {
    // Upload the image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      ...uploadOptions, // Spread additional upload options
    });

    console.log("Upload Result:", uploadResult);

    // Generate a transformed URL for the uploaded image
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: "auto", // Automatically determine the best format
      quality: "auto", // Automatically determine the best quality
      ...transformOptions, // Spread additional transformation options
    });

    console.log("Transformed URL:", transformedUrl);

    return transformedUrl;
  } catch (error) {
    console.error("Error uploading or transforming image:", error);
    throw error;
  }
};