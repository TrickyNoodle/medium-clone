import { NextRequest, NextResponse } from 'next/server';
import { sendNotificationToUserList } from '@/app/lib/notificationService';

export async function POST(request: NextRequest) {
    try {
        const { userId, title, body, url } = await request.json();
        if (!userId) {
            return NextResponse.json({ error: 'Target userId is required' }, { status: 400 });
        }
        await sendNotificationToUserList(userId, {
            title: title || 'New Update!',
            body: body || 'Check out your dashboard.',
            url: url || '/dashboard'
        });

        return NextResponse.json({ success: true, message: `Dispatched to processing loop.` });
    } catch (error) {
        return NextResponse.json({ success: false, error: "An Error Occured" }, { status: 500 });
    }
}
