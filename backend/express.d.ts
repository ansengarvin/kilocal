declare global {
    namespace Express {
        interface Request {
            user?: string;
            admin?: boolean;
            email?: string;
            dayID?: number;
        }
    }
}
export {};
