import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages, deleteUser, updateUser } from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { set } from "mongoose";

const DashProfile = () => {
  const { userInfo, errorMessage, successMessage } = useSelector(
    (state) => state.user
  );
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [localError, setLocalError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  useEffect(() => {
    // Clear messages on component mount
    dispatch(clearMessages());
    return () => {
      // Clear messages on component unmount
      dispatch(clearMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    setOriginalData({
      username: userInfo.username,
      email: userInfo.email,
      profilePicture: userInfo.profilePicture,
    });
  }, [userInfo]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
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
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (imageFileUploading) {
      return setLocalError("Please wait for image to upload");
    }
    if (Object.keys(formData).length === 0) {
      return setLocalError("No changes made");
    }
    const isFormDataChanged = Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    );
    if (!isFormDataChanged) {
      return setLocalError("No changes made");
    }
    try {
      await dispatch(updateUser({ userId: userInfo._id, formData })).unwrap();
    } catch (error) {
      setLocalError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      await dispatch(deleteUser({ userId: userInfo._id })).unwrap();
      // Replace the current history entry to prevent back navigation
      navigate("/signin", { replace: true });
      window.history.replaceState(null, null, "/signin");
    } catch (error) {
      setLocalError(error.message);
    }
  }
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || userInfo.profilePicture}
            alt="profile image"
            className={`w-full h-full rounded-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={userInfo.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={userInfo.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button type="submit" className="" gradientDuoTone="greenToBlue">
          Update
        </Button>
      </form>
      <div className="mt-4 flex justify-between">
        <span
          onClick={() => setShowModal(true)}
          className="cursor-pointer text-red-500"
        >
          Delete account
        </span>
        <span className="cursor-pointer text-red-500">Sign out</span>
      </div>
      {localError && <Alert color="failure">{localError}</Alert>}
      {errorMessage && <Alert color="failure">{errorMessage}</Alert>}
      {successMessage && <Alert color="success">{successMessage}</Alert>}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete your account?</h3>
            <div className="flex items-center justify-center gap-4">
              <Button color="failure" className="mr-2" onClick={handleDeleteUser}>
                Yes, I&apos;m sure
              </Button>
              <Button gradientDuoTone="greenToBlue" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
          
      </Modal>
    </div>
  );
};

export default DashProfile;
