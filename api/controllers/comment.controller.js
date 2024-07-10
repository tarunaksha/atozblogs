import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  const { content, postId, userId } = req.body;
  try {
    if (userId !== req.user.id)
      return next(
        errorHandler(500, "You are not authorized to perform this action")
      );

    const newComment = await Comment.create({
      content,
      postId,
      userId,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(errorHandler(404, "Comment not found"));

    const userIndex = comment.likes.findIndex((id) => id === req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes++;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes--;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  const { content } = req.body;
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(errorHandler(404, "Comment not found"));
    if (comment.userId !== req.user.id)
      return next(
        errorHandler(500, "You are not authorized to perform this action")
      );

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return next(errorHandler(404, "Comment not found"));
    if (comment.userId !== req.user.id && !req.user.isAdmin)
      return next(
        errorHandler(500, "You are not authorized to perform this action")
      );

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  if(!req.user.isAdmin) return next(errorHandler(500, "You are not authorized to perform this action"));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};