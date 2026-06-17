"use server"
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export async function createAccount(provider: string, uemail: string, upassword: string | null, uname: string) {
  if (uname == '')
    return { "error": "Username Cannot be Empty" }
  try {
    if (upassword == null) {
      await prisma.users.create({
        data: {
          provider: provider,
          uemail: uemail,
          uname: uname
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