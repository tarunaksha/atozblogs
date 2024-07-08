/* eslint-disable react/prop-types */
import { Button, Textarea } from "flowbite-react";
import moment from "moment";

import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

const Comment = ({ comment, onLike, onEdit, user }) => {
  const { userInfo } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedComment(comment.content);
  };

  const handleSave = async () => {
    try {
     const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedComment,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedComment);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-8 h-8 object-cover rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : `@anonymous user`}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <div className="flex gap-2 justify-end text-xs">
              <Button type="button" size="xs" gradientDuoTone="greenToBlue" onClick={handleSave}>
                Save
              </Button>
              <Button
                type="button"
                size="xs"
                gradientDuoTone="pinkToOrange"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 dark:text-gray-300">
              {comment.content}
            </p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  userInfo &&
                  comment.likes.includes(userInfo._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {userInfo &&
                userInfo._id === comment.userId &&
                userInfo.isAdmin && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-blue-500"
                    onClick={() => handleEdit()}
                  >
                    Edit
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
