import db from "../../utils/db/client";
import { User, Profile } from "../types";

async function handleGetLikes(
  user: User
): Promise<string[] | null> {
  console.log("User data: ", user);
  try {
    const query = `SELECT "USER".id, "USER".first_name, "USER".last_name, "USER".username
      FROM "user_likes" 
      INNER JOIN "USER" ON "user_likes"."liker_id" = "USER"."id"
      WHERE "liked_id" = $1;`;
    const { rows } = await db.query(query, [user.id]);
    console.log("rows: ", rows);
    return rows;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

async function handleGetIsProfileLiked(
  profileId: string,
  user: User
): Promise<boolean> {
  try {
    const query = `SELECT * FROM "user_likes" WHERE liker_id = $1 AND liked_id = $2;`;
    const { rows } = await db.query(query, [user.id, profileId]);
    return rows.length > 0;
  } catch (error) {
    console.error("Error getting likes:", error);
    throw error;
  }
}

async function handleLikeProfile(profileId: string, user: User): Promise<any> {
  try {
    const isProfileLiked = await handleGetIsProfileLiked(profileId, user);
    if (isProfileLiked) {
      throw "Profile already liked";
    }
    const query = `INSERT INTO "user_likes" (liker_id, liked_id) VALUES ($1, $2);`;
    await db.query(query, [user.id, profileId]);
    return "Profile liked successfully";
  } catch (error) {
    console.error("Error liking profile:", error);
    throw error;
  }
}

export { handleGetLikes, handleLikeProfile, handleGetIsProfileLiked };
