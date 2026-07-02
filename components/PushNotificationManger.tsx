'use client';

import { useEffect, useState } from 'react';
import { urlBase64ToUint8Array } from '@/app/lib/VapidConvert';
import { sessionuser } from './store';
import { AnimatePresence, motion } from 'motion/react'
import { RxCross1 } from 'react-icons/rx';

export default function PushNotificationManager() {
    const uid = sessionuser((state) => state.uid)
    const [isSupported, setIsSupported] = useState<boolean>(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [cancel, setcancel] = useState<boolean>(false)

    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            const sub = await registration.pushManager.getSubscription();
            console.log(sub)
            setSubscription(sub);
        } catch (error) {
            console.error('Service worker registration failed:', error);
        }
    }
    useEffect(() => {
        function run() {

            if ('serviceWorker' in navigator && 'PushManager' in window) {
                setIsSupported(true);
                registerServiceWorker();
            }
        }
        run()
    }, []);

    async function subscribeToPush() {
        try {
            if (!uid) {
                throw new Error('User is not signed in');
            }

            const registration = await navigator.serviceWorker.ready;
            const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

            if (!publicKey) {
                throw new Error('VAPID public key is missing from environment variables');
            }

            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
            });

            setSubscription(sub);

            await fetch('/api/push/subscribe?uid=' + uid, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub),
            });
        } catch (error) {
            console.error('Failed to subscribe user: ', error);
        }
    }

    if (!isSupported) {
        return <p>Push notifications are not supported in this browser.</p>;
    }

    return (
        <AnimatePresence>
            {!cancel ? !subscription ?
                <motion.div animate={{ y: [-100, 0] }} exit={{ y: [0, -100] }} transition={{ type: "keyframes", ease: "easeInOut" }} className="p-4 border-b flex flex-col">
                    <h3 className="text-lg font-bold mb-2">Hey! Can we Notify You for new Posts?</h3>
                    {subscription ? (
                        <p className="text-green-600">✅ You are successfully subscribed!</p>
                    ) : (
                        <div className='flex gap-2'>
                            <button
                                onClick={subscribeToPush}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                            >
                                Enable Notifications
                            </button>
                            <button onClick={() => setcancel(true)} className='px-4 py-2 border rounded-md hover:backdrop-brightness-90 cursor-pointer'><RxCross1 className='text-xl' /> Cancel</button>
                        </div>
                    )}
                </motion.div> : null : null}
        </AnimatePresence>
    );
}
