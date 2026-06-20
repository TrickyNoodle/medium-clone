"use client"
import Link from 'next/link';
import { CiSearch } from "react-icons/ci";
import { TfiPencilAlt } from 'react-icons/tfi';
import { sessionuser } from './store';
import { signOut, useSession } from 'next-auth/react';
import { getUserDetails } from '@/app/lib/Account';
import { useEffect } from 'react';

const NavbarHome = () => {
    const { setuser } = sessionuser((state) => state)
    const { data: session } = useSession()
    const userimage = session?.user?.image
    const provider = session?.user?.image?.includes("github") ? "github" : session?.user?.image?.includes("google") ? "google" : "credentials"
    useEffect(() => {
        const fetchUser = async () => {
            if (!session?.user?.email) return;
            const data = await getUserDetails(
                session.user.email,
                provider
            );
            setuser({
                uid: data?.uid as number,
                uname: data?.name as string,
            });
        };

        fetchUser();
    }, [session, provider, setuser]);
    return (
        <div className='sticky flex justify-between top-0 p-2 px-4 left-0 right-0 bg-white   '>
            <div className='flex gap-4 items-center'>
                <Link href={"/home"}
                    className="text-3xl primary-font font-bold bg-linear-to-r from-blue-500 to-black bg-clip-text text-black hover:text-transparent transition-colors duration-300"
                >
                    Medium Clone
                </Link>
                <label className='flex items-center h-full focus-within:text-black text-gray-400'>
                    <CiSearch className='text-2xl flex items-center' />
                    <input type="text" placeholder='Search' className='px-2 text-sm outline-none h-full items-center flex ' />
                </label>
            </div>
            <div className='px-4'>
                <ol className='flex gap-8 h-full text-sm items-center'>
                    <li className='hover:text-black text-gray-500'><Link href={"/home/new_post"} className='flex gap-2 items-center h-full'>
                        <TfiPencilAlt className='text-xl' /> Write
                    </Link></li>
                    <li className='hover:text-black text-gray-500'><Link href={"/home/profile"} className='flex gap-2 items-center'>
                        <img src={userimage || "/default_avatar.png"} loading='lazy' className='size-8 rounded-full' />
                        {session?.user?.name}
                    </Link></li>
                    <li className='flex hover:backdrop-brightness-75 h-full w-full'><button className='cursor-pointer size-full' onClick={() => signOut()}>SignOut</button></li>
                </ol>
            </div>
        </div>
    )
}

export default NavbarHome