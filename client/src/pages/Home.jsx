import { Link } from "react-router-dom";
import { CallToAction, PostCard } from "../components";
import { useEffect, useState } from "react";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const response = await fetch("/api/post/getposts");
        const data = await response.json();
        setPosts(data.posts);
      };

      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my blog</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Here you&apos;ll find a variety of articles and tutorials on topics
          such as web development, software engineering, and programming
          languages.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-green-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
      {posts && posts.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-center mb-5">Recent posts</h2>
          <div className="flex flex-wrap gap-4">
            {posts.map((post) => (
             <PostCard key={post._id} post={post} />
            ))}
          </div>
          <Link to="/search" className="text-lg text-green-500 hover:underline text-center">
          View all posts
          </Link>
        </div>

      )}
      </div>
    </div>
  );
};

export default Home;
