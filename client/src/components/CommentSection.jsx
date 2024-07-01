import { Alert, Button, Textarea } from "flowbite-react";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CommentSection = ({ postId }) => {
  const { userInfo } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return;
    if (comment.length > 200) return;
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment, postId, userId: userInfo._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
      }
    } catch (error) {
      setCommentError("An error occurred. Please try again later.");
    }
  };
   
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {userInfo ? (
        <div className="flex items-center gap-1 my-5 text-sm text-gray-500">
          <p>Signed in as:</p>
          <img
            src={userInfo.profilePicture}
            className="w-5 h-5 object-cover rounded-full"
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-600 hover:underline"
          >
            @{userInfo.username}
          </Link>
        </div>
      ) : (
        <div className="flex gap-1 text-sm">
          <p>You must be signed in to comment</p>
          <Link to="/signin" className="text-teal-600 underline">
            Sign in
          </Link>
        </div>
      )}
      {userInfo && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5 ">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="greenToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5" >
              {commentError}
            </Alert>
          )}
        </form>
      )}
    </div>
  );
};

export default CommentSection;
