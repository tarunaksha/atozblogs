import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left section */}
        <div className="flex-1">
          {" "}
          {/* to get equal space for left and right side */}
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              A to Z{" "}
            </span>
            Blogs
          </Link>
          <p className="text-sm mt-5">
            To continue, please sign up with your email and password or your Google account
          </p>
        </div>
        {/* right sectioh */}
        <div className="flex-1">
          {" "}
          {/* to get equal space for left and right side */}
          <form action="" className="flex flex-col gap-4">
            <div>
              <Label value="Your username" />
              <TextInput
                id="username"
                type="text"
                placeholder="Username"
                required
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput id="email" type="email" placeholder="name@company.com" required />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                id="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <Button gradientDuoTone="purpleToPink" size="lg" type="submit"> Sign Up </Button>
          </form>
          <div className="flex text-sm mt-5">
            <span>
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-500">
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
