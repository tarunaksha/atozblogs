import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

const DashProfile = () => {
  const { userInfo } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form action="" className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={userInfo.profilePicture}
            alt="profile image"
            className="w-full h-full rounded-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={userInfo.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={userInfo.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit" className="" gradientDuoTone="greenToBlue">
            Update
        </Button>
      </form>
      <div className="mt-4 flex justify-between">
        <span className="cursor-pointer text-red-500">Delete account</span>
        <span className="cursor-pointer text-red-500">Sign out</span>
      </div>
    </div>
  );
};

export default DashProfile;
