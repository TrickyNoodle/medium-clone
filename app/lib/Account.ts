"use server"
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Followers } from "../home/profile/[userid]/page";

export async function createAccount(provider: string, uemail: string, upassword: string | null, uname: string,image?:string) {
  if (uname == '')
    return { "error": "Username Cannot be Empty" }
  try {
    if (upassword == null) {
      await prisma.users.create({
        data: {
          provider: provider,
          uemail: uemail,
          uname: uname,
          image:image
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
    console.log(error)
    return { "error": "Server Error" }
  }
}
export async function getUserDetails(uid: number) {
  try {
    const result = await prisma.users.findUnique({
      where: {
        uid: uid
      }
    })
    console.log(result)
    return {
      name: result?.uname,
      email: result?.uemail,
      joined: result?.joined,
      following: result?.follows,
      bio: result?.bio,
      image: result?.image
    }
  }
  catch (error) {
    return { "error": "Cannot Fetch user Data" }
  }
}
export async function getPosts(uid: number) {
  try {
    const result = await prisma.posts.findMany({
      where: {
        uid: uid
      }
    })
    return result
  }
  catch (error) {
    return []
  }
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
