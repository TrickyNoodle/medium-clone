"use client";

import React, { useEffect, useRef, useState } from "react";
import { followingposts, getrecentposts } from "../lib/Post";
import { Post } from "../types/Post";
import { ForwardRefEditor } from "@/components/ForwardRefEditor";
import Link from "next/link";
import Tags from "@/components/Tags";
import { useRouter } from "next/navigation";
import { useInView } from "motion/react";
import { sessionuser } from "@/components/store";
import { getUserDetails } from "../lib/Account";
import { User } from "@/app/types/Account";

const Page = () => {
    const router = useRouter();
    const suser = sessionuser((state) => state);

    const [tags, settags] = useState<string[]>([]);
    const [recentposts, setrecentposts] = useState<Post[]>([]);
    const [feedtype, setfeedtype] = useState(0);
    const [user, setuser] = useState<User>();

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const load = useRef(null);
    const isinview = useInView(load);
    useEffect(() => {
        async function run() {
            if (!suser.uid) return;
            const result = await getUserDetails(suser.uid);
            setuser(result);
        }

        run();
    }, [suser]);

    async function fetchposts(offset = recentposts.length) {
        if (loading || !hasMore) return;
        if (feedtype === 1 && !user) return;

        setLoading(true);

        try {
            const result =
                feedtype === 0
                    ? await getrecentposts(offset)
                    : await followingposts(user?.following || [], offset);

            if (result.length === 0) {
                setHasMore(false);
                return;
            }

            setrecentposts((prev) => [
                ...prev,
                ...result.filter(
                    (post) => !prev.some((p) => p.pid === post.pid)
                ),
            ]);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (feedtype === 1 && !user) return;
        async function run() {
            setrecentposts([]);
            setHasMore(true);
            await fetchposts(0);
        }
        run();
    }, [feedtype, user]);
    useEffect(() => {
        if (!isinview) return;
        async function run() {
            fetchposts();
        }
        run();
    }, [isinview]);

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6 items-center">
            <div className="flex border rounded-md text-base md:text-xl w-fit sticky top-4 md:top-10 z-50 bg-white shadow-sm">
                <label
                    className={`px-4 py-3 md:p-4 rounded-md rounded-r-none cursor-pointer transition-colors ${feedtype === 0 ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                        }`}
                >
                    <input
                        type="radio"
                        className="hidden"
                        checked={feedtype === 0}
                        onChange={() => setfeedtype(0)}
                    />
                    Latest Posts
                </label>

                <label
                    className={`px-4 py-3 md:p-4 rounded-md rounded-l-none cursor-pointer transition-colors ${feedtype === 1 ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                        }`}
                >
                    <input
                        type="radio"
                        className="hidden"
                        checked={feedtype === 1}
                        onChange={() => setfeedtype(1)}
                    />
                    Following
                </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full relative items-start">

                {recentposts.length !== 0 && (
                    <div className="md:col-span-1 border md:sticky md:top-32 h-fit rounded-md flex flex-col p-4 text-lg md:text-xl shadow-md bg-white">
                        <p className="font-semibold mb-2">Filter Posts By Tags</p>
                        <Tags tags={tags} settags={settags} />
                    </div>
                )}

                {/* Feed Section */}
                <div className={`${recentposts.length !== 0 ? "md:col-span-3" : "md:col-span-4"} flex flex-col gap-4 w-full`}>
                    {recentposts
                        .filter((p) => {
                            if (tags.length === 0) return true;
                            return p.tags.some((tag) => tags.includes(tag));
                        })
                        .map((p) => (
                            <div
                                key={p.pid}
                                className="border rounded-md bg-white shadow-sm hover:shadow-md transition-shadow w-full cursor-pointer overflow-hidden flex flex-col"
                                onClick={() => router.push("/home/post/" + p.pid)}
                            >
                                <p className="text-lg md:text-xl font-bold p-3 md:p-4 pb-1">
                                    {p.pname}
                                </p>

                                <div className="px-3 md:px-4">
                                    <ForwardRefEditor
                                        markdown={p.pcontent?.slice(0, 50) || ""}
                                        readOnly
                                        className="bg-gray-50 rounded-md p-2 text-sm md:text-base border border-gray-100"
                                    />
                                </div>

                                {/* Responsive Card Footer */}
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 md:p-4 text-xs md:text-sm items-start sm:items-center mt-auto border-t border-gray-50">
                                    <Link
                                        href={"/home/profile/" + p.uid}
                                        onClick={(e) => e.stopPropagation()}
                                        className="hover:underline font-bold text-gray-700"
                                    >
                                        By {p.uname}
                                    </Link>

                                    {/* Scrollable tags if they overflow on tiny mobile devices */}
                                    <div className="flex flex-wrap gap-1.5 max-w-full">
                                        {p.tags.map((tag) => (
                                            <button
                                                key={tag}
                                                className="px-2.5 py-1 text-xs rounded-full border shadow-sm hover:shadow transition-all cursor-pointer bg-white"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!tags.includes(tag)) {
                                                        settags([...tags, tag]);
                                                    }
                                                }}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>

                                    <p className="text-gray-400 sm:ml-auto">
                                        {p.created?.toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <div className="w-full text-center py-4">
                {feedtype === 1 && user?.following?.length === 0 ? (
                    <p className="text-gray-500 text-sm md:text-base px-4">
                        Your Following List is Empty, Please Follow Someone First.
                    </p>
                ) : (
                    <button
                        ref={load}
                        disabled={loading || !hasMore}
                        className="underline text-lg md:text-xl cursor-pointer disabled:opacity-50 disabled:no-underline text-gray-700 font-medium"
                        onClick={() => fetchposts()}
                    >
                        {loading
                            ? "Loading..."
                            : hasMore
                                ? "Load More"
                                : "That's it, No more Posts ❤️"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Page;