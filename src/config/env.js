export const ENV = {
    MONGODB_URI: process.env.MONGODB_URI,

    JWT_ADMIN_SECRET: process.env.JWT_ADMIN_SECRET,
    JWT_CLIENT_SECRET: process.env.JWT_CLIENT_SECRET,

    ADMIN_COOKIE_NAME: process.env.ADMIN_COOKIE_NAME,
    CLIENT_COOKIE_NAME: process.env.CLIENT_COOKIE_NAME,

    COOKIE_EXPIRE: Number(process.env.COOKIE_EXPIRE || 7),

    NODE_ENV: process.env.NODE_ENV
};