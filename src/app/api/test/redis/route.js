import { NextResponse } from 'next/server';
import redis, { connectRedis } from '@/config/redis';

export async function GET() {
    try {
        await connectRedis();

        await redis.set('crm:test', 'Redis is working!', {
            EX: 60,
        });

        const value = await redis.get('crm:test');

        return NextResponse.json({
            success: true,
            message: value,
        });
    } catch (error) {
        console.error('Redis test error:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Redis connection failed',
                error: error.message,
            },
            { status: 500 }
        );
    }
}