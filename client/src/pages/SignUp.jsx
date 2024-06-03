import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields");
      setSuccessMessage(""); // Clear success message
      return;
    }

    try {
      setErrorMessage(""); // Clear error message
      setSuccessMessage(""); // Clear success message
      setLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        // console.log(data.message);
        setErrorMessage("User already exists");
        setSuccessMessage(""); // Clear success message
        setLoading(false);
        return;
      }
      // Assume form submission is successful
      setErrorMessage(""); // Clear error message
      setSuccessMessage("User created successfully");
      setLoading(false);

      // Redirect to sign in page
      if (response.ok) {
        navigate("/signin");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later");
      setSuccessMessage(""); // Clear success message
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left section */}
        <div className="flex-1">
          {/* to get equal space for left and right side */}
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-lime-500 to-green-500 rounded-lg text-white">
              A to Z{" "}
            </span>
            Blogs
          </Link>
          <p className="text-sm mt-5">
            To continue, please sign up with your email and password or your
            Google account
          </p>
        </div>
        {/* right sectioh */}
        <div className="flex-1">
          {/* to get equal space for left and right side */}
          <form
            action=""
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div>
              <Label value="Your username" />
              <TextInput
                id="username"
                type="text"
                placeholder="Username"
                onChange={handleChange}
                // required
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                id="email"
                type="email"
                placeholder="name@company.com"
                onChange={handleChange}
                // required
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                id="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                // required
              />
            </div>
            <Button
              gradientDuoTone="tealToLime"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="flex text-sm mt-5">
            <span>
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-500">
                Sign In
              </Link>
            </span>
          </div>
          <div>
            {errorMessage && (
              <Alert color="failure" className="mt-5">
                {errorMessage}
              </Alert>
            )}
            {successMessage && !errorMessage && (
              <Alert color="success" className="mt-5">
                {successMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
