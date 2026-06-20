"use client"
import { follow, getFollowers, getfollowing, getPosts, getUserDetails, unfollow } from '@/app/lib/Account'
import ShowUsers from '@/components/ShowUsers'
import { sessionuser } from '@/components/store'
import { redirect, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Followers, User } from '@/app/types/Account'
import { Post } from '@/app/types/Post'

const Page = () => {
  const [showusers, setshowusers] = useState<string | null>(null)
  const [userdetails, setuserdetails] = useState<User>({})
  const [posts, setposts] = useState<Post[]>([]);
  const [followers, setfollowers] = useState<Followers[]>([])
  const { userid }: { userid: string } = useParams()
  const [isfollowed, setisfollowed] = useState(false);
  const [following, setfollowing] = useState<Followers[]>([])
  const suser = sessionuser((state) => state)
  const [order, setorder] = useState('ascending')
  const [search, setsearch] = useState("")
  async function changevalue(e: React.ChangeEvent<HTMLInputElement>) {
    setsearch(e.currentTarget.value)
  }
  async function followunfollow() {
    let result = null
    if (isfollowed)
      result = await unfollow(parseInt(userid), suser.uid as number)
    else
      result = await follow(parseInt(userid), suser.uid as number)
    if ((await result).msg == "success")
      setisfollowed(!isfollowed)
  }
  useEffect(() => {
    if (suser.uid == parseInt(userid))
      redirect("/home/profile")
    async function run() {
      const data = await getUserDetails(parseInt(userid))
      setuserdetails(data)
      if (!data.error) {
        const data1 = await getPosts(parseInt(userid))
        setposts(data1)
        const data2 = await getFollowers(parseInt(userid))
        setfollowers(data2)
        data?.following?.includes(parseInt(userid)) ? setisfollowed(true) : setisfollowed(false)
        const data3 = await getfollowing(data?.following as number[])
        setfollowing(data3)
      }
    }
    run()
  }, [suser])
  if (userdetails.error)
    throw new Error(userdetails.error)
  return (
    <div className='flex flex-col gap-4 py-2'>
      <div className='flex p-8  rounded-md shadow-md hover:shadow-xl border gap-4 justify-between transition-all duration-300 w-full'>
        <div className='flex gap-4 w-full items-center'>
          <img src={userdetails.image as string} className='rounded-full w-20' />
          <div className='flex flex-col justify-stretch'>
            <p className='text-sm'>Joined Medium on {userdetails.joined?.toDateString()}</p>
            <p className='primary-font text-2xl font-bold'>{userdetails.name}</p>
            <p className='text-md w-full text-gray-400'>{userdetails.bio}</p>
          </div>
        </div>
        <div className='flex items-center w-full justify-end'>
          <ul className='flex gap-4 [&>li]:hover:underline items-center [&>li]:transition-all [&>li]:duration-300'>
            <li className='text-xl' onClick={() => setshowusers("Following")}>{userdetails.following?.length} Following</li>
            <li className='text-xl' onClick={() => setshowusers("Followers")}>{followers.length} Followers</li>
            {showusers ? <ShowUsers follows={userdetails.following as number[]} users={showusers == "Following" ? following : followers} setshowusers={setshowusers} showusers={showusers} /> : null}
            <li><button onClick={followunfollow} className={`tranisiton-all duration-300 cursor-pointer hover:shadow-md hover:text-white font-bold ${isfollowed ? "hover:bg-red-400" : "hover:bg-green-500"} text-xl border-2 px-4 py-2 rounded-md ${isfollowed ? "border-red-400" : "border-green-500"}`}>{isfollowed ? "UnFollow" : "Follow"}</button></li>
          </ul>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-2'>
        {posts.length != 0 ? <div className='primary-font text-2xl col-span-3 flex justify-between items-center gap-4'>
          <label htmlFor="" className='flex gap-2 w-full'>
            Search:
            <input type="text" name="" id="" className='px-2 border rounded-md w-full' value={search} onChange={changevalue} />
          </label>
          <div className='flex rounded-md justify-end'>
            <label htmlFor="newest" onClick={() => setorder("ascending")} className={`${order == "ascending" ? "backdrop-brightness-90" : ""} cursor-pointer p-2 text-xl border border-r-0 text-nowrap`}>
              Newest First
            </label>
            <input type="radio" name="sort" id="newest" className='size-0' />
            <label htmlFor='oldest' onClick={() => setorder("descending")} className={`${order == "descending" ? "backdrop-brightness-90" : ""} cursor-pointer p-2 text-xl border border-l-0 text-nowrap`}>
              Oldest First
            </label>
            <input type="radio" name="sort" id="oldest" className='size-0' />
          </div>
        </div> : null}
        {posts.length == 0 ? <div className='col-span-3 border p-4 backdrop-brightness-90 rounded-md'>
          <p className='text-center text-xl font-bold'>This User Hasn&apos;t Posted Anything Yet</p>
        </div> : order == "ascending" ? posts.map((post) => {
          if (post.pname.includes(search))
            return <div key={post.pid} onClick={() => redirect("/home/post/" + post.pid)} className='border-2 flex flex-col w-full justify-center pt-2 rounded-md shadow-md hover:shadow-2xl'>
              <p className='flex primary-font text-xl p-2'>{post.pname}</p>
              <div className='text-sm backdrop-brightness-90 rounded-md rounded-t-none justify-between w-full flex items-center' >
                <span className='py-1 px-4'>{post.created?.toDateString()}</span>
              </div>
            </div>
        }) : posts.toReversed().map((post) => {
          if (post.pname.includes(search))
            return <div key={post.pid} onClick={() => redirect("/home/post/" + post.pid)} className='border-2 flex flex-col w-full justify-center pt-2 rounded-md shadow-md hover:shadow-2xl'>
              <p className='flex primary-font text-xl p-2'>{post.pname}</p>
              <div className='text-sm backdrop-brightness-90 rounded-md rounded-t-none justify-between w-full flex items-center' >
                <span className='py-1 px-4'>{post.created?.toDateString()}</span>
              </div>
            </div>
        })}
      </div>
    </div>
  )
}

export default Page