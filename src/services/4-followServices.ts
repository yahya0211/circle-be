import db from "../lib/db";

export const follow = async (followerId: string, followingId: string) => {
  const existingFollow = await db.follow.findFirst({
    where: {
      followerId,
      followingId,
    },
  });
  
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  if (!existingFollow) {
    await db.follow.create({
      data: {
        followerId: followerId,
        followingId: followingId,
      },
    });
    return "following successfull";
  } else {
    await db.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });
    return "unfollowing successfull";
  }
};
