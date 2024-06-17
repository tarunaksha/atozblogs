import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashPosts = () => {
  const { userInfo } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/post/getposts?userId=${userInfo._id}`
        );
        const data = await response.json();
        if (response.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (userInfo.isAdmin) {
      fetchPosts();
    }
  }, [userInfo._id]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {userInfo.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>date updated</Table.HeadCell>
              <Table.HeadCell>post image</Table.HeadCell>
              <Table.HeadCell>post title</Table.HeadCell>
              <Table.HeadCell>category</Table.HeadCell>
              <Table.HeadCell>delete</Table.HeadCell>
              <Table.HeadCell>
                <span>edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body key={post._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-700">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString("en-GB")}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-10 object-cover bg-gray-500"
                    />
                    </Link>
                    </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <button
                      className="text-red-500 font-medium hover:underline cursor-pointer"
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            `/api/post/deletepost/${post._id}`,
                            {
                              method: "DELETE",
                            }
                          );
                          if (response.ok) {
                            setUserPosts((prevPosts) =>
                              prevPosts.filter((p) => p._id !== post._id)
                            );
                          }
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </Table.Cell>
                  <Table.Cell className="text-teal-500 hover:underline cursor-pointer">
                    <Link to={`/update-post/${post._id}`}>Edit</Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
    </div>
  );
};

export default DashPosts;
