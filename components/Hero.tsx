import { redirect } from 'next/navigation'
import { HideSignUp } from './store'
import { useSession } from 'next-auth/react'

const Hero = () => {
    const session = useSession()
    const { setHide } = HideSignUp((state) => state)
    return (
        <div className='flex w-full h-lvh items-center'>
            <div className='flex flex-col gap-12 text-left px-4'>
                <div className='primary-font md:text-8xl text-7xl md:leading-20 leading-16 font-medium'>
                    <p >Human</p>
                    <p >stories & ideas</p>
                </div>
                <p className='md:text-2xl text-xl'>A place to read, write, and deepen your understanding</p>
                <button onClick={() => session.status != "authenticated" ? setHide(false) : redirect("/home", "push")} className='md:text-2xl text-xl md:bg-black w-fit text-white bg-green-700 rounded-full px-8 py-2 hover:cursor-pointer '>Start Reading</button>
            </div>
        </div>
    )
}

export default Hero