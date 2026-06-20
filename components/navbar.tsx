"use client"
import { useSession } from 'next-auth/react'
import { HideSignUp } from './store'
import { redirect } from 'next/navigation'

const Navbar = () => {
  const { setHide } = HideSignUp((state) => state)
  const { data: session } = useSession()
  return (
    <div className='flex justify-between mx-auto z-99 fixed top-0 left-0 right-0 flex-col backdrop-blur-2xl'>
      <div className='flex md:w-8/12 md:mx-auto justify-between p-5'>
        <h1 onClick={() => redirect("/", "replace")} className='primary-font text-3xl font-bold'>Medium Clone</h1>
        <ol className='flex gap-8 font-light items-center justify-center text-sm [&>li]:hover:translate-y-0.5 [&>li]:cursor-pointer '>
          <li onClick={() => session?.user ? redirect("/home/new_post", "push") : setHide(false)} className='md:block hidden transition-all duration-300'>Write</li>
          <li className='transition-all duration-300'><button className='px-4 py-2 rounded-full bg-black text-white cursor-pointer' onClick={session?.user?.name ? () => redirect("/home/profile", "push") : () => { setHide(false) }}>{session?.user?.name ? <div className='flex items-center gap-2'><img src={session.user.image || "/default_avatar.png"} alt="" className='h-6 rounded-full bg-white' />{session.user.name}</div> : "Get Started"}</button></li>
        </ol>
      </div>
      <hr />
    </div>
  )
}

export default Navbar
