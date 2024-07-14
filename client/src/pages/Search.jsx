import { Button, Select, TextInput } from "flowbite-react";
import { PostCard } from "../components";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("searchTerm");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    if (search) {
      setSidebarData({
        ...sidebarData,
        searchTerm: search,
        sort: sort,
        category: category,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const searchQuery = searchParams.toString();
        const res = await fetch(`/api/post/getPosts?${searchQuery}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setPosts(data.posts);

        setLoading(false);
        if (data.posts.length < 9) {
          setShowMore(false);
        } else {
          setShowMore(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category: category });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("searchTerm", sidebarData.searchTerm);
    searchParams.set("category", sidebarData.category);
    searchParams.set("sort", sidebarData.sort);
    const searchQuery = searchParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    try {
      const searchParams = new URLSearchParams(location.search);
      const searchQuery = searchParams.toString();
      const response = await fetch(
        `/api/post/getPosts?${searchQuery}&startIndex=${startIndex}`
      );
      const data = await response.json();
      if (response.ok) {
        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        } else {
          setShowMore(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex gap-2 items-center">
            <label className="whitespace-nowrap font-semibold">
              Search Term:{" "}
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="whitespace-nowrap font-semibold">
              Category:{" "}
            </label>
            <Select
              id="category"
              value={sidebarData.category}
              onChange={handleChange}
              className="border border-gray-300 rounded-md"
            >
              <option value="uncatagorized">Uncategorized</option>
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="angular">Angular</option>
              <option value="nextjs">Next JS</option>
              <option value="linux">Linux</option>
              <option value="windows">Windows</option>
              <option value="games">Games</option>
              <option value="anime">Anime</option>
              <option value="manga">Manga</option>
              <option value="comics">Comics</option>
              <option value="books">Books</option>
              <option value="movies">Movies</option>
            </Select>
          </div>
          <div className="flex gap-2 items-center">
            <label className="whitespace-nowrap font-semibold">Sort: </label>
            <Select
              id="sort"
              value={sidebarData.sort}
              onChange={handleChange}
              className="border border-gray-300 rounded-md"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </Select>
          </div>
          <Button type="submit" gradientDuoTone="greenToBlue">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts results:{" "}
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
