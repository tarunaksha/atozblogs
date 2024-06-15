import { TextInput, Select, FileInput, Button } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  const [value, setValue] = useState("");
  return (
    <div className="max-w-3xl min-h-screen mx-auto p-3">
      <h1 className="text-center text-3xl font-semibold my-4">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            id="title"
            placeholder="Enter the title of the post"
            className="flex-1"
            required
          />
          <Select>
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
          <FileInput type="file" id="image" accept="image/*" />
          <Button type="button" size="sm" gradientDuoTone="greenToBlue" outline>
            Upload Image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          className="h-72 mb-12"
          placeholder="Write something..."
          required
        />
        <Button type="submit" size="lg" gradientDuoTone="greenToBlue">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
