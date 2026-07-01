import { NextRequest, NextResponse } from 'next/server';
import webpush, { PushSubscription } from 'web-push';

webpush.setVapidDetails(
  'mailto:TrickyNoodle@medium_clone.com', // Must be your administrative email address
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
);

interface NotificationPayload {
  subscription: PushSubscription;
  title?: string;
  body?: string;
  url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const bodyData: NotificationPayload = await request.json();
    const { subscription, title, body, url } = bodyData;

    if (!subscription) {
      return NextResponse.json({ error: 'Missing subscription field' }, { status: 400 });
    }

    const payload = JSON.stringify({
      title: title || 'Notification Title',
      body: body || 'Notification body text content goes here.',
      url: url || '/'
    });

    await webpush.sendNotification(subscription, payload);
    return NextResponse.json({ success: true, message: 'Notification sent successfully.' });
  } catch (error) {
    console.error('Error sending push notification via web-push:', error);
    return NextResponse.json({ success: false, error: "An Error Occured" }, { status: 500 });
  }
}
