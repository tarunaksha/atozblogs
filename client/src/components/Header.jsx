import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { setGlobalError, signout } from "../redux/user/userSlice";

const Header = () => {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const handleProfileClick = () => {
    navigate("/dashboard?tab=profile");
  };

  const handleSignOutClick = async () => {
    try {
      await dispatch(signout()).unwrap();
      // Replace the current history entry to prevent back navigation
      navigate("/signin", { replace: true });
      window.history.replaceState(null, null, "/signin");
    } catch (error) {
      dispatch(setGlobalError(error.message));
    }
  };
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-sl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-lime-500 to-green-500 rounded-lg text-white">
          A to Z{" "}
        </span>
        Blogs
      </Link>
      <form action="">
        <TextInput
          type="text"
          placeholder="Search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline md:inline"
        />
      </form>
      <Button className="w-12 h-8 lg:hidden md:hidden" color="gray" pill>
        <AiOutlineSearch className="" />
      </Button>
      <div className="flex gap-2 items-center md:order-2">
        <Button
          className="w-12 h-8"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {userInfo ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={userInfo.profilePicture} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">@{userInfo.username}</span>
              <span className="block font-bold text-md truncate">
                {userInfo.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={handleProfileClick}>Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOutClick}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/signin">
            <Button size="xs" gradientDuoTone="greenToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
