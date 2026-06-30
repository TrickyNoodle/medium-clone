"use client"
import Link from 'next/link';
import { TfiPencilAlt } from 'react-icons/tfi';
import { sessionuser } from './store';
import { signOut, useSession } from 'next-auth/react';
import { getUserDetails } from '@/app/lib/Account';
import { useEffect } from 'react';
import Search from './Search';

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
                uname: data?.uname as string,
            });
        };

        fetchUser();
    }, [session, provider, setuser]);
    return (
        <div className='sticky flex justify-between top-0 p-2 px-4 left-0 right-0 bg-white z-500 w-full'>
            <div className='flex gap-4 items-center w-full md:w-2/3'>
                <Link href={"/home"}
                    className="text-3xl w-fit primary-font font-bold bg-linear-to-r  from-blue-500 to-black bg-clip-text text-black hover:text-transparent transition-colors duration-300"
                >
                    Medium Clone
                </Link>
                <Search />
            </div>
            <div className='px-4'>
                <ol className='flex gap-8 h-full text-sm items-center'>
                    <li className='hover:text-black text-gray-500'><Link href={"/home/new_post"} className='flex  gap-2 items-center h-full'>
                        <TfiPencilAlt className='text-xl' /> <span className='md:block hidden'>Write</span>
                    </Link></li>
                    <li className='hover:text-black text-gray-500'><Link href={"/home/profile"} className='flex gap-2 items-center size-fit'>
                        <img src={userimage || "/default_avatar.png"} loading='lazy' className='md:size-8 block h-10 w-20 rounded-full' />
                        <p className='md:block hidden'>{session?.user?.name}</p>
                    </Link></li>
                </ol>
            </div>
        </div>
    )
}

export default NavbarHome