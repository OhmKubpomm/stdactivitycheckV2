"use server";

import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary";
import User from "@/models/Usermodel";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function uploadphotoToCloud(formData) {
  try {
    const files = formData.getAll("files");
    const file = files[0]; // Only process the first file
    const data = await file.arrayBuffer();
    const buffer = Buffer.from(data);
    const name = uuidv4();
    const ext = file.type.split("/")[1];

    return new Promise((resolve) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            resource_type: "image", // Ensure resource type is 'image'
            public_id: `uploadfrom_nextjs/${name}`,
            format: ext, // Specify the image format
          },
          (error, result) => {
            if (error) {
              console.error(error);
            } else {
              resolve([result]); // Return an array with a single object for consistency
            }
          }
        )
        .end(buffer);
    });
  } catch (error) {
    console.error(error);
    return formData.status(500).json({ error: error.message });
  }
}

export async function uploadPhoto(formData, userId) {
  try {
    // Upload to Cloudinary
    const photos = await uploadphotoToCloud(formData);

    // Check for errors from Cloudinary
    if (photos.error) throw new Error(photos.error);

    // Update photo URL in MongoDB
    const newPhotos = photos.map((photo) => {
      const newPhoto = { image: photo.secure_url };
      console.log("newphoto:", newPhoto);
      return newPhoto;
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { image: newPhotos[0].image },
      { new: true }
    );
    revalidatePath("/");
    if (!user) {
      return { error: "User not found" };
    }

    return { msg: "เพิ่มรูปภาพสำเร็จ", image: newPhotos };
  } catch (error) {
    console.error(error);
    return formData.status(500).json({ error: error.message });
  }
}

function extractPublicIdFromUrl(url) {
  const splitArr = url.split("/");
  const lastSegment = splitArr[splitArr.length - 1];
  const publicId = lastSegment.split(".")[0]; // remove file extension
  return `uploadfrom_nextjs/${publicId}`;
}

export async function deletePhoto(userId, imageUrl) {
  try {
    const publicId = extractPublicIdFromUrl(imageUrl);

    await cloudinary.v2.uploader.destroy(publicId);

    // Update MongoDB
    await User.findByIdAndUpdate(userId, { image: "" }, { new: true });
    revalidatePath("/");

    return { msg: "ลบรูปภาพสำเร็จ" };
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}
export async function insertPhoto(formData2) {
  try {
    // upload to cloudiary
    const photos = await uploadphotoToCloud(formData2);

    // update photo user to mongodb
    const newPhotos = photos.map((photo) => {
      const newPhoto = { image: photo.secure_url };

      return newPhoto;
    });

    revalidatePath("/");

    return { msg: "เพิ่มรูปภาพสำเร็จ", image: newPhotos };
  } catch (error) {
    // end update photo user

    return { error: error.message };
  }
}
