import { signIn, } from 'next-auth/react'
import { HideSignUp } from './store'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useState } from 'react'
import { redirect, useSearchParams } from 'next/navigation'
const Signup = () => {
    const { Hide, setHide } = HideSignUp((state) => state)
    const params = useSearchParams();
    const [error, seterror] = useState("")
    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        const formdata = new FormData(e.currentTarget)
        const result = await signIn("credentials", { email: formdata.get("email"), password: formdata.get("password"), redirect: false })
        if (result.error)
            seterror("Invalid Credentials : Please Check Again")
        else
            redirect("/home")
    }
    return (
        <AnimatePresence>
            {Hide ? "" :
                <motion.div onClick={() => setHide(true)} className={`z-999 flex fixed top-0 left-0 right-0 bottom-0 justify-center items-center backdrop-blur-sm backdrop-brightness-50 text-black`}>
                    <motion.div onClick={(e) => { e.stopPropagation() }} initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.15, type: 'keyframes' }} exit={{ scale: 0.95 }} className='mx-auto bg-white flex flex-col rounded-md text-center items-center p-16 h-2/4 justify-evenly'>
                        <p className='primary-font text-4xl'>Join Medium Clone.</p>
                        <div className='flex w-full gap-2'>
                            <button className="p-2 border rounded-full hover:backdrop-brightness-90 cursor-pointer w-full" onClick={() => { signIn("github") }}>Sign in with Github</button>
                            <button className="p-2 border rounded-full hover:backdrop-brightness-90 cursor-pointer w-full" onClick={() => { signIn("google") }}>Sign in with Google</button>
                        </div>
                        <hr className='border-1/2 w-full my-2' />
                        <form onSubmit={handleSubmit} className='flex flex-col items-center gap-2 text-center justify-center w-90'>
                            <input className='p-2 border rounded-md w-full outline-none text-center' type="text" name='email' placeholder='email@example.com' />
                            <input className='p-2 border rounded-md w-full outline-none text-center' type="password" name='password' placeholder='password' />
                            <button type="submit" className="p-2 border rounded-full hover:backdrop-brightness-90 cursor-pointer w-full">Sign in with Email and Password</button>
                        </form>
                        <p className='text-red-500 italic'>{error}</p>
                        <p>By Signing In u will be able to Post,Read and Comment other Posts</p>
                        <Link className="hover:underline hover:text-green-700" href="/create-account">No Account?Create One Instead!</Link>
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default Signup