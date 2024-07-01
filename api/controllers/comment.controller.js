import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  const { content, postId, userId } = req.body;
  try {
    if(userId !== req.user.id) return next(errorHandler(500,"You are not authorized to perform this action"));

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