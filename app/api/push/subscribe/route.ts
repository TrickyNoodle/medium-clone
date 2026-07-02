import { updatePushSubscriptionIfChanged } from '@/app/lib/Account';
import { NextRequest, NextResponse } from 'next/server';
import { PushSubscription } from 'web-push';

export async function POST(request: NextRequest) {
    const subscription: PushSubscription = await request.json();
    const uid = parseInt(request.nextUrl.searchParams.get("uid") as string)
    if (!subscription || !subscription.endpoint || !uid) {
        return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }

    const result = await updatePushSubscriptionIfChanged(subscription, uid);
    if ('error' in result) {
        return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
    }

    return NextResponse.json({ success: true, updated: result.updated });
}
