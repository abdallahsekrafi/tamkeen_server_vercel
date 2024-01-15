import Posts from "../models/postModel.js";
import Users from "../models/userModel.js";
import Comments from "../models/commentModel.js";

// create a new post (new tamkeen)
export const createPost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const {
      description,
      image,
      isAccessibility,
      isGivingHelp,
      isMental,
      isMotor,
      isHearing,
      isVisual,
      isPsychological,
    } = req.body;

    const post = await Posts.create({
      userId,
      description,
      image,
      isAccessibility,
      isGivingHelp,
      isMental,
      isMotor,
      isHearing,
      isVisual,
      isPsychological,
    });

    res.status(200).json({
      sucess: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// get All Tamkeens with aggregate function
export const getPosts = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const populateQuery = [
      {
        path: "userId",
        select:
          "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
      },
      {
        path: "comments",
        populate: {
          path: "userId",
          select:
            "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
        },
        options: {
          sort: "-_id",
        },
      },
      {
        path: "comments",
        populate: {
          path: "replies.userId",
          select:
            "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
        },
      },
    ];

    // get all cerent user posts
    let currentUserPosts = await Posts.find({ userId });
    // populate cerent user posts
    currentUserPosts = await Posts.populate(currentUserPosts, populateQuery);

    // get all frends posts
    let frendsgPosts = await Users.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "Posts",
          localField: "friends",
          foreignField: "userId",
          as: "frendsgPosts",
        },
      },
      {
        $project: {
          frendsgPosts: 1,
          _id: 0,
        },
      },
    ]);
    // populate frends posts
    frendsgPosts = await Posts.populate(frendsgPosts, populateQuery);

    res.status(200).json(
      currentUserPosts.concat(...frendsgPosts[0].frendsgPosts).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// get searched posts in description field (temkeens)
export const getSearchPosts = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { search } = req.body;

    const user = await Users.findById(userId);
    const friends = user?.friends?.toString().split(",") ?? [];
    // get all userId include curent userId
    friends.push(userId);

    const searchPostQuery = {
      $or: [
        {
          description: { $regex: search, $options: "i" },
        },
      ],
    };

    // get all post where description include search
    const posts = await Posts.find(search ? searchPostQuery : {})
      .populate({
        path: "userId",
        select:
          "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select:
            "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
        },
        options: {
          sort: "-_id",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies.userId",
          select:
            "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
        },
      })
      .sort({ _id: -1 });

    // get the frends posts (include the current user pots) from total posts
    const friendsPosts = posts?.filter((post) => {
      return friends.includes(post?.userId?._id.toString());
    });

    // get the others posts from the total posts
    const otherPosts = posts?.filter(
      (post) => !friends.includes(post?.userId?._id.toString())
    );

    let postsRes = [...friendsPosts, ...otherPosts];

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: postsRes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//get post bu id
export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Posts.findById(id)
      .populate({
        path: "userId",
        select:
          "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select:
            "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
        },
        options: {
          sort: "-_id",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies.userId",
          select:
            "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
        },
      });

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// get user post
export const getUserPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Posts.find({ userId: id })
      .populate({
        path: "userId",
        select:
          "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select:
            "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
        },
        options: {
          sort: "-_id",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies.userId",
          select:
            "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
        },
      })
      .sort({ _id: -1 });

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//get comments for a particular post
export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const postComments = await Comments.find({ postId })
      .populate({
        path: "userId",
        select:
          "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
      })
      .populate({
        path: "replies.userId",
        select:
          "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: postComments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// support a post
export const supportPost = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;

    const post = await Posts.findById(id);

    const index = post.supports.findIndex((pid) => pid === String(userId));

    if (index === -1) {
      post.supports.push(userId);
    } else {
      post.supports = post.supports.filter((pid) => pid !== String(userId));
    }

    const newPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: newPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// support comment/relply
export const supportPostComment = async (req, res, next) => {
  const { userId } = req.body.user;
  const { id, rid } = req.params;

  try {
    if (rid === undefined || rid === null || rid === `false`) {
      const comment = await Comments.findById(id);

      const index = comment.supports.findIndex((el) => el === String(userId));

      if (index === -1) {
        comment.supports.push(userId);
      } else {
        comment.supports = comment.supports.filter((i) => i !== String(userId));
      }

      const updated = await Comments.findByIdAndUpdate(id, comment, {
        new: true,
      });

      res.status(201).json(updated);
    } else {
      const replyComments = await Comments.findOne(
        { _id: id },
        {
          replies: {
            $elemMatch: {
              _id: rid,
            },
          },
        }
      );

      const index = replyComments?.replies[0]?.supports.findIndex(
        (i) => i === String(userId)
      );

      if (index === -1) {
        replyComments.replies[0].supports.push(userId);
      } else {
        replyComments.replies[0].supports =
          replyComments.replies[0]?.supports.filter(
            (i) => i !== String(userId)
          );
      }

      const query = { _id: id, "replies._id": rid };

      const updated = {
        $set: {
          "replies.$.supports": replyComments.replies[0].supports,
        },
      };

      const result = await Comments.updateOne(query, updated, { new: true });

      res.status(201).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// comment a post
export const commentPost = async (req, res, next) => {
  try {
    const { comment, from } = req.body;
    const { userId } = req.body.user;
    const { id } = req.params;

    if (comment === null) {
      return res.status(404).json({ message: "Comment is required." });
    }

    const newComment = new Comments({ comment, from, userId, postId: id });

    await newComment.save();

    //updating the post with the comments id
    const post = await Posts.findById(id);

    post.comments.push(newComment._id);

    const updatedPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// reply comment
export const replyPostComment = async (req, res, next) => {
  const { userId } = req.body.user;
  const { comment, replyAt, from } = req.body;
  const { id } = req.params;

  if (comment === null) {
    return res.status(404).json({ message: "Comment is required." });
  }

  try {
    const commentInfo = await Comments.findById(id);

    commentInfo.replies.push({
      comment,
      replyAt,
      from,
      userId,
      created_At: Date.now(),
    });

    commentInfo.save();

    res.status(200).json(commentInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//delete post
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Posts.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// get All Tamkeens with filter function
export const getTamkeensPosts = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    const user = await Users.findById(userId);
    const friends = user?.friends?.toString().split(",") ?? [];
    // get all userId include curent userId
    friends.push(userId);

    // get all post
    const posts = await Posts.find()
      .populate({
        path: "userId",
        select:
          "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select:
            "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
        },
        options: {
          sort: "-_id",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies.userId",
          select:
            "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
        },
      })
      .sort({ _id: -1 });

    // get the frends posts (include the current user pots) from total posts
    const friendsPosts = posts?.filter((post) => {
      return friends.includes(post?.userId?._id.toString());
    });

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: friendsPosts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// get All Tamkeens with $in function
export const getTamkeens = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    const user = await Users.findById(userId);
    // get frends ids
    const friends =
      user?.friends?.length > 0 ? user?.friends?.toString().split(",") : [];
    // push curent userId in list
    friends.push(userId);

    const posts = await Posts.find({ userId: { $in: friends } })
      .populate({
        path: "userId",
        select:
          "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select:
            "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
        },
        options: {
          sort: "-_id",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies.userId",
          select:
            "firstName lastName profileUrl isDisabled isFMDisabled isMental isMotor isHearing isVisual isPsychological -password",
        },
      })
      .sort({ _id: -1 });

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
