/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="group relative w-full h-[400px] sm:w-[350px] overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/post/${post.slug}`} className="block h-[260px]">
        <img
          src={post.image}
          alt="post cover"
          className="h-full w-full object-fit rounded-t-lg transition-transform duration-300 transform group-hover:translate-y-[-25px]"
        />
      </Link>
      <div className="p-4 flex flex-col gap-3 relative transition-transform duration-300 group-hover:translate-y-[-40px]">
        <p className="text-lg font-bold line-clamp-2 group-hover:text-teal-600 transition-colors duration-200 dark:text-white">
          {post.title}
        </p>
        <span className="text-sm text-gray-500 uppercase tracking-wide dark:text-gray-400">
          {post.category}
        </span>
      </div>
      {/* Read Article button with more padding */}
      <Link
        to={`/post/${post.slug}`}
        className="absolute bottom-[-50px] left-4 right-4 py-3 px-4 text-center bg-teal-500 text-white rounded-md transition-all duration-300 group-hover:bottom-4 dark:bg-teal-600 dark:hover:bg-teal-500"
      >
        Read Article
      </Link>
    </div>
  );
};

export default PostCard;