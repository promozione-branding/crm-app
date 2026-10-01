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
    let interval = null;
    let closed = false;

    const cleanup = () => {
        if (closed) return;
        closed = true;

        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    };

    const stream = new ReadableStream({
        start(controller) {
            const safeEnqueue = (chunk) => {
                if (closed) return false;
                try {
                    controller.enqueue(encoder.encode(chunk));
                    return true;
                } catch {
                    // Stream is gone — stop everything.
                    cleanup();
                    return false;
                }
            };

            // Initial handshake
            safeEnqueue(`event: connected\ndata: {}\n\n`);

            // Guard against overlapping polls
            let inFlight = false;

            const tick = async () => {
                if (closed || inFlight) return;
                inFlight = true;

                try {
                    const newItems = await Notification.find({
                        recipient: userId,
                        createdAt: { $gt: lastCheck },
                    })
                        .sort({ createdAt: -1 })
                        .lean();

                    if (closed) return;

                    if (newItems.length > 0) {
                        lastCheck = new Date();

                        const unreadCount = await Notification.countDocuments({
                            recipient: userId,
                            isRead: false,
                        });

                        if (closed) return;

                        const payload = JSON.stringify({
                            leads: newItems.filter((n) => n.refModel === 'Lead'),
                            tasks: newItems.filter((n) => n.refModel === 'LeadTask'),
                            unreadCount,
                        });

                        safeEnqueue(`event: new-notifications\ndata: ${payload}\n\n`);
                    } else {
                        safeEnqueue(`: ping\n\n`);
                    }
                } catch (err) {
                    console.error('SSE ERROR:', err);
                } finally {
                    inFlight = false;
                }
            };

            interval = setInterval(tick, 5000);

            // Cleanup on client disconnect
            request.signal.addEventListener('abort', () => {
                cleanup();
                try {
                    controller.close();
                } catch {}
            });
        },

        cancel() {
            // Fires if the consumer cancels (e.g. response body closed)
            cleanup();
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