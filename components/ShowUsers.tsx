import { Followers } from '@/app/home/profile/[userid]/page'
import { redirect } from 'next/navigation'
import React from 'react'

const ShowUsers = ({ users, showusers, setshowusers }: { users: Followers[], showusers: string, setshowusers: React.Dispatch<React.SetStateAction<string | null>> }) => {
    return (
        <div className='justify-center items-center flex z-999 backdrop-blur-md h-full fixed bottom-0 left-0 right-0' onClick={() => setshowusers(null)}>
            <div onClick={(e)=>e.stopPropagation()} className='bg-white shadow-xl border rounded-md p-2 flex flex-col gap-4  max-h-2/3'>
                <p className='text-center primary-font text-2xl'>{users.length} {showusers}</p>
                <hr className='w-full' />
                <div className='flex flex-col gap-2'>
                    {users.map((user, i) => {
                        return <div key={user.uid} className='flex p-2 border rounded-md items-center gap-2 hover:shadow-xl shadow-md' onClick={() => redirect("/home/profile/" + user.uid)}>
                            <img src={user.image as string} alt="" className='w-1/12' />
                            <p>{user.uname}</p>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default ShowUsers