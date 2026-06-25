"use client";

import { useEffect} from "react";
import { useRouter } from "next/navigation";

export default function Error({
    error,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.replace("/home")
        }, 3000);
        return () => { clearTimeout(timer); }
    }, [router]);
    return (
        <div className="flex w-full justify-center items-center p-8 flex-col gap-4">
            <p className="text-2xl text-red-500 font-bold backdrop-brightness-90 p-8 rounded-md border hover:bg-red-300">
                {error.message}
            </p>
            <p className="text-xl">
                You will be redirected to Home Page
            </p>
        </div>
    );
}