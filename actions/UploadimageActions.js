"use server";
import path from "path";
import os from "os";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "cloudinary";
import User from "@/models/Usermodel";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
async function savePhotoLocal(formData2) {
  const files = formData2.getAll("files");

  const multipleBufferPromise = files.map((file) =>
    file.arrayBuffer().then((data) => {
      const buffer = Buffer.from(data);
      const name = uuidv4();
      const ext = file.type.split("/")[1];

      const tempdir = os.tmpdir();
      const uploadDir = path.join(tempdir, `/${name}.${ext}`);
      console.log(uploadDir);
      fs.writeFile(uploadDir, buffer);
      return { filepath: uploadDir, filename: file.name };
    })
  );
  return await Promise.all(multipleBufferPromise);
}
async function uploadphotoToCloud(newFiles) {
  const multiplePhotoPromise = newFiles.map((file) =>
    cloudinary.v2.uploader.upload(file.filepath, {
      folder: "uploadfrom_nextjs",
    })
  );
  return await Promise.all(multiplePhotoPromise);
}
export async function uploadPhoto(formData2, userId) {
  try {
    // save photo to temp folder
    const newFiles = await savePhotoLocal(formData2);

    // upload to cloudiary
    const photos = await uploadphotoToCloud(newFiles);
    // delete photo in temp folder after upload to cloudiary
    console.log("New files to upload:", newFiles);

    // Use await here to ensure file deletion
    await Promise.all(newFiles.map((file) => fs.unlink(file.filepath)));

    // update photo user to mongodb
    const newPhotos = photos.map((photo) => {
      const newPhoto = { image: photo.secure_url };

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
    // end update photo user

    return { error: error.message };
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
    // save photo to temp folder
    const newFiles = await savePhotoLocal(formData2);

    // upload to cloudiary
    const photos = await uploadphotoToCloud(newFiles);
    // delete photo in temp folder after upload to cloudiary
    newFiles.map((file) => fs.unlink(file.filepath));

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
