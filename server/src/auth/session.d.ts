import 'express-session';

declare module 'express-session' {
    interface SessionData {
        accessToken?: string;
        refreshToken?: string;
        user?: {
            id: number;
            username: string;
            large_photo_url?: string;
            small_photo_url?: string;
            tiny_photo_url?: string;
        };
    }
}
