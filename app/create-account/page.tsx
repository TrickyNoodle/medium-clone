"use client"
import { useSession } from "next-auth/react"
import { GrGithub, GrGoogle } from "react-icons/gr"
import { MdEmail } from "react-icons/md"
import { createAccount } from "../lib/Account"
import { useState } from "react"
import { motion } from "motion/react"
import { redirect } from "next/navigation"
const Page = () => {
  const [errorcode, seterrorcode] = useState("")
  const session = useSession()
  const provider =
    session.status === "authenticated"
      ? session.data.user?.image?.includes("github")
        ? "github"
        : "google"
      : "credentials";
  const email = session.data?.user?.email
  async function signUp(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    let result = null
    if (session.status == "authenticated") {
      result = await createAccount(provider, email as string, null, data.get("uname") as string,session.data.user?.image as string)
    } else {
      result = await createAccount(provider, data.get("email") as string, data.get("password") as string, data.get("uname") as string
      )
    }
    if (result?.error) {
      console.log(result.error)
      seterrorcode(result.error)
    }
    else {
      redirect("/home")
    }
  }
  return (
    <>
      <img alt="" src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png" className="md:block hidden -z-99 fixed right-0 top-0 bottom-0" />
      <div className='flex flex-col items-center justify-center gap-4 h-lvh  backdrop-blur-lg'>
        {provider == "google" ?
          <p className="text-4xl primary-font items-center"><GrGoogle className="w-full" /> Google Sign On</p>
          :
          provider == "github" ?
            <p className="text-4xl primary-font items-center"><GrGithub className="w-full" /> Github Sign On</p>
            :
            <p className="text-4xl primary-font items-center"><MdEmail className="w-full" /> Email Sign On</p>
        }
        <form onSubmit={signUp} className="[&>label>input]:p-2 shadow-2xl bg-white [&>label>input]:border [&>label>input]:rounded-md border p-8 rounded-md [&>label]:transition-all [&>label]:duration-300 flex justify-center items-center [&>label]:w-full flex-col [&>label]:text-xl [&>label]:text-left [&>label]:flex [&>label]:flex-col [&>label>input]:outline-none [&>label>input]:px-4 [&>label]: [&>label]:p-4 [&>label]:rounded-md ">
          <label htmlFor="">
            How Can People Uniquely Identify You?
            <input type="text" placeholder="Username" name="uname" />
          </label>
          {!["google", "github"].includes(provider) &&
            <>
              <label htmlFor="">
                Email
                <input type="email" placeholder="Email" name="email" />
              </label>
              <label htmlFor="">
                Password
                <input type="password" placeholder="Password" name="password" />
              </label>
            </>
          }
          <button className="w-full px-8 my-4  hover:cursor-pointer border-2 rounded-full p-2 hover:shadow-2xl active:translate-y-1 transition-all duration-300" type="submit">SignUp with {provider}</button>
          {errorcode == "" ? null : <motion.p initial={{ rotateX: 180, scale: 0 }} animate={{ rotateX: 360, scale: 1 }} exit={{ scale: 0 }} className="cursor-pointer flex bg-red-300 p-2 w-full rounded-md border border-red-600 justify-center hover:underline" onClick={() => seterrorcode("")}>{errorcode}</motion.p>}
        </form>
      </div>
    </>
  )
}

export default Page