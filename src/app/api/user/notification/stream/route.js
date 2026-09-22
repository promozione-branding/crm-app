// src/app/api/user/notification/stream/route.js

import jwt from 'jsonwebtoken';
import { connectDB } from '@/config/db';
import { ENV } from '@/config/env';
import User from '@/models/user.model';
import Notification from '@/models/notification.model';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    await connectDB();

    const token = request.cookies.get(ENV.CLIENT_COOKIE_NAME)?.value;

    if (!token) {
        return new Response('Unauthorized', { status: 401 });
    }

    let user;
    try {
        const decoded = jwt.verify(token, ENV.JWT_CLIENT_SECRET);
        user = await User.findById(decoded.id);
    } catch {
        return new Response('Unauthorized', { status: 401 });
    }

    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const userId = user._id.toString();

    const encoder = new TextEncoder();

    let lastCheck = new Date();

    const stream = new ReadableStream({
        async start(controller) {
            // Send initial ping so client knows it's connected
            controller.enqueue(encoder.encode(`event: connected\ndata: {}\n\n`));

            // Poll every 5 seconds for new notifications
            const interval = setInterval(async () => {
                try {
                    const newItems = await Notification.find({
                        recipient: userId,
                        createdAt: { $gt: lastCheck },
                    })
                        .sort({ createdAt: -1 })
                        .lean();

                    if (newItems.length > 0) {
                        lastCheck = new Date();

                        const unreadCount = await Notification.countDocuments({
                            recipient: userId,
                            isRead: false,
                        });

                        const payload = JSON.stringify({
                            leads: newItems.filter((n) => n.refModel === 'Lead'),
                            tasks: newItems.filter((n) => n.refModel === 'LeadTask'),
                            unreadCount,
                        });

                        controller.enqueue(
                            encoder.encode(`event: new-notifications\ndata: ${payload}\n\n`)
                        );
                    } else {
                        // keepalive ping every 5s
                        controller.enqueue(encoder.encode(`: ping\n\n`));
                    }
                } catch (err) {
                    console.error('SSE ERROR:', err);
                }
            }, 5000);

            // Cleanup when client disconnects
            request.signal.addEventListener('abort', () => {
                clearInterval(interval);
                try {
                    controller.close();
                } catch {}
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}