import Post from "../models/post.model.js";

import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const slug = req.body.title
    .toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedsPost = await newPost.save();
    res.status(201).json(savedsPost);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const query = {};
    if (req.query.userId) query.userId = req.query.userId;
    if (req.query.slug) query.slug = req.query.slug;
    if (req.query.category) query.category = req.query.category;
    if (req.query.postId) query._id = req.query.postId;

    if (req.query.searchTerm) {
      const searchTerm = req.query.searchTerm;
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const timeNow = new Date();
    const oneMonthAgo = new Date(
      timeNow.getFullYear(),
      timeNow.getMonth() - 1,
      timeNow.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
    
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }

  try {

    const { title, content, category, image } = req.body;

    // Fetch the current post
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    // Check if the title is being changed
    if (post.title !== title) {
      // Check for duplicate title
      const existingPost = await Post.findOne({ title });
      if (existingPost) {
        return next(errorHandler(400, "Duplicate title found"));
      }
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title,
          content,
          category,
          image,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};