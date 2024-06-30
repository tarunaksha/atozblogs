import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdatePost = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { postId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [formData, setFormData] = useState({ image: "" });

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const response = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await response.json();
        if (!response.ok) {
          setPublishError(data.message);
          return;
        } else {
          setPublishError(null);
          setFormData((prevFormData) => ({
            ...prevFormData,
            ...data.posts[0], // Merge existing fields with fetched data
          })); // Update with existing image URL
        }
      };
      fetchPost();
    } catch (error) {
      setPublishError("Could not fetch post");
    }
  }, [postId]);
 
    


  const handleImageUpload = async () => {
    try {
      if (!file) {
        setImageFileUploadError("Please select an image");
        return;
      }
      setImageFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadError("Could not upload image (max size: 2MB)");
          setImageFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUploadProgress(null);
            setImageFileUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageFileUploadError("Image upload failed");
      setImageFileUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/post/updatepost/${postId}/${userInfo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.statusCode === 500) {
          setPublishError("Could not update post. Please try again later");
          return;
        }
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        setFormData({});
        setFile(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Could not update post");
    }
  };

  return (
    <div className="max-w-3xl min-h-screen mx-auto p-3">
      <h1 className="text-center text-3xl font-semibold my-4">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            id="title"
            placeholder="Enter the title of the post"
            className="flex-1"
            required
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="uncatagorized">Select a category</option>
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="angular">Angular</option>
            <option value="nextjs">Next JS</option>
            <option value="linux">Linux</option>
            <option value="windows">Windows</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-blue-500 border-dotted p-3">
          <FileInput
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            size="sm"
            gradientDuoTone="greenToBlue"
            outline
            onClick={handleImageUpload}
            disabled={imageFileUploadProgress}
          >
            {imageFileUploadProgress ? (
              <div className="w-10 h-10">
                <CircularProgressbar
                  value={imageFileUploadProgress}
                  text={`${imageFileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        {formData.image && (
          <img src={formData.image} alt="post-image" className="w-full h-72" />
        )}
        <ReactQuill
          theme="snow"
          className="h-72 mb-12"
          placeholder="Write something..."
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
          value={formData.content}
        />
        {publishError && (
          <Alert color="failure" className="">
            {publishError}
          </Alert>
        )}
        <Button type="submit" size="lg" gradientDuoTone="greenToBlue">
          Update
        </Button>
      </form>
    </div>
  );
};

export default UpdatePost;
