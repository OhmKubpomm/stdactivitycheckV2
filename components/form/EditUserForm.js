/* eslint-disable array-callback-return */
"use client";
import React, { useRef, useState } from "react";
import { updateUser } from "@/actions/userActions";
import { deletePhoto, uploadPhoto } from "@/actions/UploadimageActions";
import ButtonLoad from "../globals/ButtonLoad";
import { useMyContext } from "@/context/provider";
import { useRouter } from "next/navigation";
import { Form, Input, message, Upload, Modal } from "antd";
import { Title, Card } from "@tremor/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";

const EditUserForm = () => {
  /* โค้ดเกี่ยวกับการอัพโหลดรูปภาพ */
  const [files, setFiles] = useState([]);
  async function handleInputFiles(e) {
    const files = e.target.files;
    const newFiles = [...files].filter((file) => {
      if (file.type.startsWith("image/")) {
        return file;
      }
    });
    setFiles((prev) => [...newFiles, ...prev]);
  }

  async function handleDeleteFiles(index) {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  }

  async function handleuploadCloud() {
    if (!files.length) return alert("กรุณาเลือกไฟล์");
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await uploadPhoto(formData, editUser._id);
      if (res?.msg) {
        message.success(res.msg);
      } else if (res?.error) {
        message.error(res.error);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัพโหลดไฟล์:", error);
      message.error("การอัพโหลดรูปภาพล้มเหลว กรุณาลองใหม่");
    }
  }
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = async (file) => {
    setPreviewImage(file.thumbUrl);
    setPreviewOpen(true);
  };
  /* ปิดโค้ดเกี่ยวกับการอัพโหลดรูปภาพ */

  const handleDelete = async () => {
    const resdelete = await deletePhoto(editUser?._id, editUser?.image);
    if (resdelete?.msg) {
      message.success(resdelete?.msg);
    }
    if (resdelete?.error) {
      message.error(resdelete?.error);
    }
  };

  const router = useRouter();
  const { editUser } = useMyContext();

  const formRef = useRef();

  async function handleAction(formData1) {
    const {
      name,
      email,
      password,
      Firstname,
      Lastname,
      Date,
      Address,
      Telephone,
      image,
      userType,
    } = formData1;

    const resupdate = await updateUser({
      name,
      email,
      password,
      Firstname,
      Lastname,
      Date,
      Address,
      Telephone,
      image,
      userType,
      id: editUser._id,
    });

    if (resupdate?.msg) {
      message.success(resupdate?.msg);
    }
    if (resupdate?.error) {
      message.error(resupdate?.error);
    }
  }

  return (
    <>
      <Card className="gap-4 rounded-lg p-6 shadow-md ">
        <Title className="mb-4 text-2xl font-semibold">แก้ไขข้อมูลผู้ใช้</Title>
        <Form
          onFinish={handleAction}
          ref={formRef}
          className="flex flex-col space-y-6"
          initialValues={{
            name: editUser?.name,
            email: editUser?.email,
            password: editUser?.password,
            Firstname: editUser?.Firstname,
            Lastname: editUser?.Lastname,
            Date: editUser?.Date,
            Address: editUser?.Address,
            Telephone: editUser?.Telephone,
            userType: editUser?.userType,
          }}
        >
          <div className="space-y-4">
            <Form.Item label="ชื่อผู้ใช้" name="name">
              <Input type="text" name="name" className="rounded border " />
            </Form.Item>
            <Form.Item label="อีเมล" name="email">
              <Input type="email" name="email" className="rounded border" />
            </Form.Item>
            <Form.Item label="รหัสผ่าน" name="password">
              <Input.Password
                type="password"
                name="password"
                className="rounded border"
              />
            </Form.Item>
          </div>

          <div className="flex space-x-4">
            <Form.Item label="ชื่อจริง" name="Firstname">
              <Input
                type="text"
                name="Firstname"
                className="w-full rounded border"
              />
            </Form.Item>
            <Form.Item label="นามสกุล" name="Lastname">
              <Input
                type="text"
                name="Lastname"
                className="w-full rounded border"
              />
            </Form.Item>
          </div>

          <div className="space-y-4">
            <Form.Item label="วันที่" name="Date">
              <Input type="date" name="Date" className="rounded border" />
            </Form.Item>
            <Form.Item label="ที่อยู่" name="Address">
              <Input.TextArea
                type="textarea"
                name="Address"
                className="rounded border"
              />
            </Form.Item>
            <Form.Item label="เบอร์โทรศัพท์" name="Telephone">
              <Input type="tel" name="Telephone" className="rounded border" />
            </Form.Item>
            <Form.Item label="ประเภทผู้ใช้" name="userType">
              <div className="space-y-2">
                <Select name="userType" defaultValue={editUser?.userType}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทผู้ใช้" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">ปกติ</SelectItem>
                    <SelectItem value="transfer">เทียบโอน</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Form.Item>
          </div>

          <div className="flex space-x-4">
            <ButtonLoad
              htmlType="submit"
              value="ยืนยัน"
              className="rounded bg-blue-500 px-4 py-2 text-white"
            />
          </div>
        </Form>

        <Form.Item label="รูปภาพ" className="mb-4">
          {editUser?.image && (
            <div className="mb-4">
              <Image
                sizes="100vw"
                style={{ width: "200", height: "auto" }}
                width={200}
                height={100}
                src={editUser?.image}
                alt={editUser?.image}
                quality={60}
                className=" opacity-0 transition-opacity"
                onLoad={(image) => {
                  image.target.classList.remove("opacity-0");
                }}
              />

              <ButtonLoad
                onClick={handleDelete}
                value="ลบรูปภาพ"
                className="rounded bg-red-500 px-4 py-2 text-white"
              />
            </div>
          )}
        </Form.Item>

        {/* อัพโหลดรูปภาพ */}
        <Form onFinish={handleuploadCloud} ref={formRef}>
          <Form.Item label="อัพโหลดรูปภาพ" className="mb-4">
            <Upload
              listType="picture-card"
              className="image-upload-grid"
              fileList={files.map((file, index) => ({
                uid: file.name,
                name: file.name,
                status: "done",
                thumbUrl: URL.createObjectURL(file),
              }))}
              onPreview={handlePreview}
              onRemove={(file) =>
                handleDeleteFiles(files.findIndex((f) => f.name === file.name))
              }
              beforeUpload={(file, fileList) => {
                handleInputFiles({ target: { files: fileList } });
                return false;
              }}
            >
              {files.length >= 8 ? null : <div>เพิ่มรูปภาพ</div>}
            </Upload>

            {/* Preview Modal */}
            <Modal
              open={previewOpen}
              footer={null}
              onCancel={() => setPreviewOpen(false)}
            >
              <Image
                alt={previewImage}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                width={200}
                height={100}
                src={previewImage}
                priority={true}
                quality={60}
              />
            </Modal>
          </Form.Item>

          <Form.Item>
            <ButtonLoad
              icon={UploadOutlined}
              value="เพิ่มรูปภาพ"
              className="rounded bg-gray-300 px-4 py-2"
            />
          </Form.Item>
        </Form>
        {/* ปิดอัพโหลดรูปภาพ */}

        <ButtonLoad
          onClick={() => router.back()}
          value="ย้อนกลับ"
          className="rounded bg-gray-300 px-4 py-2"
        />
      </Card>
    </>
  );
};

export default EditUserForm;
