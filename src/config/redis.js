// src/config/redis.js

import { createClient } from 'redis';

const redis = createClient({
    url: process.env.REDIS_URL,
});

redis.on('connect', () => {
    console.log('🔌 Redis connecting...');
});

redis.on('ready', () => {
    console.log('✅ Redis ready');
});

redis.on('error', (error) => {
    console.error('❌ Redis error:', error);
});

redis.on('reconnecting', () => {
    console.log('🔄 Redis reconnecting...');
});

export async function connectRedis() {
    if (!redis.isOpen) {
        console.log('🚀 Connecting to Redis...');
        await redis.connect();
    }

    return redis;
}

export default redis;