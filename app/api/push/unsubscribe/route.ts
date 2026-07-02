import { removePushSubscription } from '@/app/lib/Account';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const uid = parseInt(request.nextUrl.searchParams.get('uid') as string);
    if (!uid) {
        return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
    }

    const result = await removePushSubscription(uid);
    if ('error' in result) {
        return NextResponse.json({ error: 'Unable to remove subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
