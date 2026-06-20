"use server"
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Followers, User } from "@/app/types/Account";

export async function createAccount(provider: string, uemail: string, upassword: string | null, uname: string, image?: string) {
  if (uname == '')
    return { "error": "Username Cannot be Empty" }
  try {
    if (upassword == null) {
      await prisma.users.create({
        data: {
          provider: provider,
          uemail: uemail,
          uname: uname,
          image: image
        }
      })
    }
    else {
      if (uemail == '' || upassword == '')
        return { "error": "Email and Password Cannot be Empty" }
      await prisma.users.create({
        data: {
          provider: provider,
          uemail: uemail,
          uname: uname,
          upassword: bcrypt.hashSync(upassword)
        }
      })
    }
  }
  catch (error) {
    if (error instanceof PrismaClientKnownRequestError)
      switch (error.code) {
        case 'P2002':
          return { "error": "Username already Exists With This Email" }
          break;
        default:
          return { "error": "An Unknown Error Occured" }
      }
    return { "error": "Server Error" }
  }
}

export async function getUserDetails(uid: number): Promise<User>;
export async function getUserDetails(email: string, provider: string): Promise<User>;

export async function getUserDetails(
  arg1: number | string,
  arg2?: string
): Promise<User> {
  let result;
  if (typeof arg1 === "number") {
    result = await prisma.users.findUnique({
      where: {
        uid: arg1,
      },
    });
  } else {
    result = await prisma.users.findUnique({
      where: {
        provider_uemail: {
          provider: arg2!,
          uemail: arg1,
        },
      },
    });
  }
  if (!result)
    return { "error": "User Not Found" }
  return {
    uid: result?.uid,
    name: result?.uname,
    email: result?.uemail,
    joined: result?.joined,
    following: result?.follows,
    bio: result?.bio,
    image: result?.image,
  };
}
export async function getFollowers(uid: number) {
  try {
    const result = await prisma.users.findMany({
      where: {
        follows: {
          has: uid
        }
      },
      select: {
        uid: true,
        uname: true,
        image: true
      }
    })
    return result
  }
  catch (error) {
    return []
  }
}
export async function getfollowing(uid: number[]): Promise<Followers[]> {
  const result = await prisma.users.findMany({
    where: {
      uid: {
        in: uid
      }
    },
    select: {
      uid: true,
      uname: true,
      image: true
    }
  })
  return result
}
export async function follow(uid: number, userid: number) {
  try {
    await prisma.users.update({
      data: {
        follows: {
          push: uid
        }
      },
      where: {
        uid: userid
      }
    })
    return { "msg": "success" }
  }
  catch (error) {
    return { "msg": "error" }
  }
}
export async function unfollow(uid: number, userid: number) {
  try {
    const user = await getUserDetails(userid);

    await prisma.users.update({
      where: {
        uid: userid,
      },
      data: {
        follows: {
          set: user?.following?.filter((value) => value !== uid) ?? [],
        },
      },
    });
    return { "msg": "success" }
  } catch (error) {
    return { "msg": "error" }
  }
}
export async function getPosts(uid: number) {
  try {
    const result = await prisma.posts.findMany({
      where: {
        uid: uid
      },
      orderBy: {
        pid: "desc"
      }
    })
    return result
  }
  catch (error) {
    return []
  }
}
export async function updatebio(uid: number, bio: string) {
  try {
    const result = await prisma.users.update({
      data: {
        bio: bio
      },
      where: {
        uid: uid
      }
    })
    return { "msg": "success" }
  }
  catch (error) {
    return { "msg": "error" }
  }
}
export async function deletePost(pid: number) {
  try {
    await prisma.posts.delete({
      where: {
        pid: pid
      }
    })
    return { "msg": "success" }
  }
  catch (error) {
    return { "msg": "error" }
  }
}