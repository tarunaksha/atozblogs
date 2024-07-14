import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Home,
  Dashboard,
  About,
  SignIn,
  SignUp,
  Projects,
  CreatePost,
  UpdatePost,
  PostPage,
  Search,
} from "./pages";
import {
  Header,
  Footer,
  PrivateRoute,
  OnlyAdminPrivateRoute,
  ScrollToTopComp,
} from "./components";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTopComp />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
