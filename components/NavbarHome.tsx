import Link from 'next/link';
import { CiSearch } from "react-icons/ci";
import { TfiPencilAlt } from 'react-icons/tfi';
import { auth } from '@/auth';

const NavbarHome = async () => {
    const session = await auth()
    const userimage = session?.user?.image
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
                        <img src={userimage || "./default_avatar.png"} loading='lazy' className='size-8 rounded-full' />
                        {session?.user?.name}
                    </Link></li>
                </ol>
            </div>
        </div>
    )
}

export default NavbarHome