
import { Button, Modal, Table } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashComments = () => {
  const { userInfo } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comment/getComments`);
        const data = await response.json();
        if (response.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (userInfo.isAdmin) {
      fetchComments();
    }
  }, [userInfo._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const response = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await response.json();
      if (response.ok) {
        setComments((prevcomments) => [...prevcomments, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

    const handleDeleteComment = async () => {
      setShowModal(false);
      try {
        const response = await fetch(
          `/api/comment/deleteComment/${commentIdToDelete}`,
          {
            method: "DELETE",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          console.error(data.message);
        } else {
          setComments((prevcomments) =>
            prevcomments.filter((comment) => comment._id !== commentIdToDelete)
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {userInfo.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>date updated</Table.HeadCell>
              <Table.HeadCell>comment content</Table.HeadCell>
              <Table.HeadCell>no. of likes</Table.HeadCell>
              <Table.HeadCell>post id</Table.HeadCell>
              <Table.HeadCell>user id</Table.HeadCell>
              <Table.HeadCell>delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-700">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString("en-GB")}
                  </Table.Cell>
                  <Table.Cell>
                  {comment.content}
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>
                   {comment.userId}
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      className="text-red-500 font-medium hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                    >
                      Delete
                    </button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              className="w-full text-teal-500 self-center text-sm py-7 font-medium cursor-pointer hover:underline"
              onClick={handleShowMore}
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p>
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
                onClick={handleDeleteComment}
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

export default DashComments;
