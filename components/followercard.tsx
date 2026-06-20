import { follow, unfollow } from '@/app/lib/Account';
import { Followers } from '@/app/types/Account'
import { redirect } from 'next/navigation'
import { useState } from 'react';
import { sessionuser } from './store';

const Followercard = ({ user, inital }: { user: Followers, inital: boolean }) => {
    const [isfollowed, setisfollowed] = useState(inital);
    const suser = sessionuser((state) => state)
    async function followunfollow(uid: number) {
        let result = null
        if (isfollowed)
            result = await unfollow(uid, suser.uid as number)
        else
            result = await follow(uid, suser.uid as number)
        if ((await result).msg == "success")
            setisfollowed(!isfollowed)
    }
    return (
        <div className='flex p-2 border rounded-md items-center gap-2 hover:shadow-xl shadow-md justify-between' onClick={() => redirect("/home/profile/" + user.uid)}>
            <div className='flex items-center gap-2'>
                <img src={user.image as string} alt="" className='size-10 rounded-full' />
                <p>{user.uname}</p>
            </div>
            <li onClick={(e) => e.stopPropagation()}><button onClick={() => { followunfollow(user.uid as number) }} className={`tranisiton-all duration-300 cursor-pointer hover:shadow-md hover:text-white font-bold ${isfollowed ? "hover:bg-red-400" : "hover:bg-green-500"} text-xl border-2 px-4 py-2 rounded-md ${isfollowed ? "border-red-400" : "border-green-500"}`}>{isfollowed ? "UnFollow" : "Follow"}</button></li>
        </div>
    )
}

export default Followercard