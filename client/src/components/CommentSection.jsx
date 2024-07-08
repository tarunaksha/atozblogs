/* eslint-disable react/prop-types */
import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";


const CommentSection = ({ postId }) => {
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [users, setUsers] = useState({});

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
        body: JSON.stringify({
          content: comment,
          postId,
          userId: userInfo._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments((prev) => [data, ...prev]);
      }
    } catch (error) {
      setCommentError("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!userInfo) {
        navigate("/signin");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId ? { ...comment, ...data } : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async (userIds) => {
    const usersData = {};
    for (const userId of userIds) {
      if (!users[userId]) {
        try {
          const res = await fetch(`/api/user/${userId}`);
          const data = await res.json();
          if (res.ok) {
            usersData[userId] = data; 
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    setUsers((prevUsers) => ({
      ...prevUsers,
      ...usersData,
    }));
  };

  useEffect(() => {
    const userIds = [...new Set(comments.map((comment) => comment.userId))];
    fetchUsers(userIds);
  }, [comments]);

  const handleEdit = async (comment, editedComment) => {
   setComments(comments.map((c) => c._id === comment._id ? {...c, content: editedComment} : c));
  };

  const handleDeleteComment = async (commentId) => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error);
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
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm mt-5">No comments yet</p>
      ) : (
        <>
          <div className="flex text-sm my-5 items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm bg-gray-200">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map(
            (comment) =>
              users[comment.userId] && (
                <Comment
                  key={comment._id}
                  user={users[comment.userId]}
                  comment={comment}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={(commentId) => {
                    setShowModal(true);
                    setCommentToDelete(commentId);
                  }}
                />
              )
          )}
        </>
      )}
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
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex items-center justify-center gap-4">
              <Button
                color="failure"
                className="mr-2"
                onClick={() => handleDeleteComment(commentToDelete)}
              >
                Yes, I&apos;m sure
              </Button>
              <Button
                gradientDuoTone="greenToBlue"
                onClick={() => setShowModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CommentSection;
