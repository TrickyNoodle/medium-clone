import { addPushSubscription } from '@/app/lib/Account';
import { NextRequest, NextResponse } from 'next/server';
import { PushSubscription } from 'web-push';

export async function POST(request: NextRequest) {
    const subscription: PushSubscription = await request.json();
    const uid = parseInt(request.nextUrl.searchParams.get("uid") as string)

    if (!subscription || !subscription.endpoint || uid) {
        return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }
    // TODO: Save this object to your database mapped to a specific user context
    const result = await addPushSubscription(subscription, uid)
    if (result.error)
        return NextResponse.json({ error: 'Invalid Request' }, { status: 400 })

    return NextResponse.json({ success: true });
}
