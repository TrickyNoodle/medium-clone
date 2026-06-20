import { Followers } from '@/app/types/Account'
import React from 'react'
import Followercard from './followercard';

const ShowUsers = ({ users, showusers, setshowusers, follows }: { follows: number[], users: Followers[], showusers: string, setshowusers: React.Dispatch<React.SetStateAction<string | null>> }) => {
    return (
        <div className='justify-center items-center flex z-999 backdrop-blur-md h-full fixed bottom-0 left-0 right-0' onClick={() => setshowusers(null)}>
            <div onClick={(e) => e.stopPropagation()} className='bg-white shadow-xl border rounded-md p-2 flex flex-col gap-4  max-h-2/3 min-w-1/2'>
                <p className='text-center primary-font text-2xl'>{users.length} {showusers}</p>
                <hr className='w-full' />
                <div className='flex flex-col gap-2'>
                    {users.map((user, i) => {
                        return <Followercard key={user.uid} user={user} inital={follows.includes(user.uid as number) || false} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default ShowUsers