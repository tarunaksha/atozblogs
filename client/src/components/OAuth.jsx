import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { googleSignIn, googleSignUp } from "../redux/user/userSlice";

// eslint-disable-next-line react/prop-types
const OAuth = ({isSignUp}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const formData = {
        name: resultFromGoogle.user.displayName,
        email: resultFromGoogle.user.email,
        googlePhotoURL: resultFromGoogle.user.photoURL,
      };
      
      if (isSignUp) {
        dispatch(googleSignUp(formData))
          .unwrap()
          .then(() => {
            navigate("/");
          })
          .catch((error) => {
            console.log("Sign Up Error:", error);
          });
      } else {
        dispatch(googleSignIn(formData))
          .unwrap()
          .then(() => {
            navigate("/");
          })
          .catch((error) => {
            console.log("Sign In Error:", error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button type="button" outline color="dark" onClick={handleGoogleClick}>
      <AiFillGoogleCircle className="w-6 h-5 mr-1" /> Continue with Google
    </Button>
  );
};

export default OAuth;
