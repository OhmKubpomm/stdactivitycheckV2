"use client";
import React, { useRef, useState } from "react";
import { updateUser } from "@/actions/userActions";
import { deletePhoto, uploadPhoto } from "@/actions/UploadimageActions";
import ButtonLoad from "../globals/ButtonLoad";
import { useMyContext } from "@/context/provider";
import { useRouter } from "next/navigation";
import { Form, Input, message, Upload, Modal } from "antd";
import { Title, Card } from "@tremor/react";

import { UploadOutlined,UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined } from "@ant-design/icons";
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
    if (!files.length) return alert("Please select files");
    const formData2 = new FormData();
   
    files.forEach((file) => {
      formData2.append("files", file);
    });

    const res = await uploadPhoto(formData2, editUser._id);
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
      <Card className="gap-2 ">
        <Title className="text-2xl font-semibold mb-4">แก้ไขข้อมูล User</Title>
        <Form
          onFinish={handleAction}
          ref={formRef}
          className="flex flex-col space-y-4 p-6 overflow-y-auto"
          initialValues={{
            name: editUser?.name,
            email: editUser?.email,
            password: editUser?.password,
            Firstname: editUser?.Firstname,
            Lastname: editUser?.Lastname,
            Date: editUser?.Date,
            Address: editUser?.Address,
            Telephone: editUser?.Telephone,
          }}
        >
          <div className="space-y-4">
            <Form.Item label="Username" name="name">
              <Input
              
                type="text"
                name="name"
                
                className="border rounded "
              />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input
              
                type="email"
                name="email"
      
                className="border rounded"
              />
            </Form.Item>
            <Form.Item label="Password"  name="password">
              <Input.Password
             
                type="password"
                name="password"
            
                className="border rounded"
              />
            </Form.Item>
          </div>

          <div className="flex space-x-4">
            <Form.Item label="Firstname"  name="Firstname">
              <Input
              

                type="text"
                name="Firstname"
            
                className="border rounded w-full"
              />
            </Form.Item>
            <Form.Item label="Lastname"  name="Lastname">
              <Input
              
                type="text"
                name="Lastname"
           
                className="border rounded w-full"
              />
            </Form.Item>
          </div>

          <div className="space-y-4">
            <Form.Item label="Date"  name="Date">
              <Input
                type="date"
                name="Date"
              
                className="border rounded"
              />
            </Form.Item>
            <Form.Item label="Address"  name="Address">
              <Input.TextArea 
              
                type="textarea"
                name="Address"
      
                className="border rounded"
              />
            </Form.Item>
            <Form.Item label="Telephone" name="Telephone">
              <Input
               
                type="tel"
                name="Telephone"
              
                className="border rounded"
              />
            </Form.Item>
          </div>

          <div className="flex space-x-4">
            <ButtonLoad
              htmlType="submit"
              value="Submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            />
          </div>
        </Form>


        <Form.Item label="Image" className="mb-4">
           
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
                 className="transition-opacity opacity-0 duration-[2s]"
                 onLoadingComplete={(image) => { image.classList.remove('opacity-0'); }}
               />

               <ButtonLoad
                 onClick={() => deletePhoto(editUser?._id, editUser?.image)}
                 value="Delete"
                 className="bg-red-500 text-white px-4 py-2 rounded"
                
               />
             </div>
           )}
              </Form.Item>
 {/* Display existing image from database */}
        <Form onFinish={handleuploadCloud} ref={formRef}>
        
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
       

          <Form.Item>
            <ButtonLoad
              icon={UploadOutlined}
              value="upload"
              className="bg-gray-300 px-4 py-2 rounded"
              
            />
          </Form.Item>
        </Form>
 {/*End Display existing image from database */}
        <ButtonLoad
          onClick={() => router.back()}
          value="go back"
          className="bg-gray-300 px-4 py-2 rounded"
        />
      </Card>
    </>
  );
};

export default EditUserForm;