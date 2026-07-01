import webpush, { WebPushError } from 'web-push';
import { getFollowers } from './Account';

// 1. Initialize VAPID
webpush.setVapidDetails(
    'mailto:your-email@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

interface NotificationPayload {
    title: string;
    body: string;
    url?: string;
}

/**
 * Sends a push notification to an array of specific user IDs
 */
export async function sendNotificationToUserList(
    userId: number,
    payloadData: NotificationPayload
) {
    // 2. Fetch all active subscriptions belonging to the target users
    const subscriptions = await getFollowers(userId);

    const notificationPayload = JSON.stringify({
        title: payloadData.title,
        body: payloadData.body,
        url: payloadData.url || '/',
    });

    // 3. Map over subscriptions and trigger push notifications concurrently
    const pushPromises = subscriptions.map(async (subRecord) => {
        try {
            // Cast your DB JSON object back to webpush.PushSubscription type
            if (!subRecord.endpoint)
                return;
            await webpush.sendNotification({
                endpoint: subRecord.endpoint,
                keys: {
                    p256dh: subRecord.p256dh as string,
                    auth: subRecord.auth as string
                }
            }, notificationPayload);
        } catch (error) {
            console.log("Failed to send")
        }
    });
    await Promise.allSettled(pushPromises);
}