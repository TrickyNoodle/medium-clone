'use client'

import { useEffect } from 'react'
import { animate, stagger } from 'motion'

export default function Loading() {
    useEffect(() => {
        animate(
            '.bar',
            { scale: [0, 1,1,1, 0],opacity:[0,1,1,1,0]},
            {
                duration: 2,
                delay: stagger(0.2),
                ease: 'easeInOut',
                repeat: Infinity,
                
            }
        )
    }, [])

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-4">
            <div className="flex gap-4">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="bar h-20 w-2 rounded-full bg-foreground"
                    />
                ))}
            </div>
            <p className='text-xl italic'>Loading...</p>
        </div>
    )
}