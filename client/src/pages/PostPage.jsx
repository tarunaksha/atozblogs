import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CallToAction, CommentSection, PostCard } from "../components";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [loadingRecentPosts, setLoadingRecentPosts] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await response.json();
        if (!response.ok) {
          setError(true);
          setLoading(false);
          return;
        } else {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
        console.error(error);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try { 
        setLoadingRecentPosts(true);
        const response = await fetch("/api/post/getposts?limit=3");
        const data = await response.json();
        if (!response.ok) {
          setError(true);
          setLoadingRecentPosts(false);
          return;
        } else {
          setRecentPosts(data.posts);
          setLoadingRecentPosts(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoadingRecentPosts(false);
        console.error(error);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading || loadingRecentPosts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="p-3 text-3xl mt-10 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="mt-5 self-center"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="w-full max-h-[600px] object-cover mt-10 p-3"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>
          {post && new Date(post.createdAt).toLocaleDateString("en-GB")}
        </span>
        <span className="italic">
          {post &&
            (post.content.length / 1000 > 1
              ? `${Math.floor(post.content.length / 1000)} mins read`
              : ` 1 min read`)}
        </span>
      </div>
      <div
        className="p-3 max-w-2xl w-full mx-auto post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl w-full mx-auto">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />
      <div className="flex flex-col items-center justify-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap mt-5 gap-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
