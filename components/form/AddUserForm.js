/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
"use client";
import React, { useRef, useState } from "react";
import { createUser } from "@/actions/userActions";
import ButtonLoad from "@/components/globals/ButtonLoad";
import { insertPhoto } from "@/actions/UploadimageActions";
import { Form, Input, message, Upload, Modal } from "antd";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Title, Card } from "@tremor/react";

import Image from "next/image";

const AddUserForm = () => {
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
    if (!files.length) return alert("Please select files");
    const formData3 = new FormData();

    files.forEach((file) => {
      formData3.append("files", file);
    });

    const res = await insertPhoto(formData3, editUser._id);
    if (res?.msg) {
      message.success(res?.msg);
    }
    if (res?.error) {
      message.error(res?.error);
    }
  }
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = async (file) => {
    setPreviewImage(file.thumbUrl);
    setPreviewOpen(true);
  };
  /* ปิดโค้ดเกี่ยวกับการอัพโหลดรูปภาพ */

  const router = useRouter();

  const messageApi = message;
  const formRef = useRef();

  async function handleAction(formData) {
    // Upload image to cloud first if there are any files
    let imageUrls;
    if (files.length) {
      const formData2 = new FormData();
      files.forEach((file) => {
        formData2.append("files", file);
      });
      const resUpload = await insertPhoto(formData2);
      if (resUpload?.error) {
        return message.error(resUpload?.error);
      }
      imageUrls = resUpload.image[0]?.image; // Assuming resUpload.image contains the image URL
    }

    // Then create the user

    const {
      name,
      email,
      password,
      Firstname,
      Lastname,
      Date,
      Address,
      Telephone,
    } = formData;

    const res = await createUser({
      name,
      email,
      password,
      Firstname,
      Lastname,
      Date,
      Address,
      Telephone,
      image: imageUrls,
    });
    console.log(res);

    if (res?.msg) {
      message.success(res?.msg);
    }
    if (res?.error) {
      message.error(res?.error);
    }
  }
  const onReset = () => {
    formRef.current?.resetFields();
    messageApi.open({
      type: "success",
      content: "reset success",
    });
  };
  return (
    <Card className="gap-4 rounded-lg p-6 shadow-md">
      <Form
        onFinish={handleAction}
        ref={formRef}
        className="flex flex-col space-y-6"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-row justify-between ">
            <Title className="text-4xl">Add User</Title>
          </div>

          <Form.Item label="Username" name="name">
            <Input type="text" name="name" className="rounded border " />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" name="email" className="rounded border" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password
              type="password"
              name="password"
              className="rounded border"
            />
          </Form.Item>

          <div className="flex space-x-4">
            <Form.Item label="Firstname" name="Firstname">
              <Input
                type="text"
                name="Firstname"
                className="w-full rounded border"
              />
            </Form.Item>
            <Form.Item label="Lastname" name="Lastname">
              <Input
                type="text"
                name="Lastname"
                className="w-full rounded border"
              />
            </Form.Item>
          </div>

          <Form.Item label="Date" name="Date">
            <Input type="date" name="Date" className="rounded border" />
          </Form.Item>
          <Form.Item label="Address" name="Address">
            <Input.TextArea
              type="textarea"
              name="Address"
              className="rounded border"
            />
          </Form.Item>
          <Form.Item label="Telephone" name="Telephone">
            <Input type="tel" name="Telephone" className="rounded border" />
          </Form.Item>

          {/* Display existing image from database */}

          <Form.Item label="upload" className="mb-4">
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
              {files.length >= 8 ? null : <div>Upload</div>}
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

          {/* End Display existing image from database */}

          <div className="flex space-x-4">
            <ButtonLoad
              htmlType="submit"
              value="Submit"
              className="rounded bg-blue-500 px-4 py-2 text-white"
            />
            <ButtonLoad
              htmlType="button"
              onClick={onReset}
              value="Reset"
              className="rounded bg-blue-300 px-4 py-2"
            />
          </div>
        </motion.div>
      </Form>

      <div className="flex space-x-4">
        <ButtonLoad
          onClick={() => router.back()}
          value="Go Back"
          className="rounded bg-gray-300 px-4 py-2"
        />
      </div>
    </Card>
  );
};

export default AddUserForm;
